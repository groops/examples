from django.db import models
from django.conf import settings
from django.contrib.auth.models import(
    AbstractBaseUser, PermissionsMixin, UserManager
)

from apps.chat.models import UserChatMixin

class User(AbstractBaseUser, PermissionsMixin, UserChatMixin):
    '''
    Customize Django's User model to specify the email as the username
    We get password verification and permission checks for free.
    '''
    email = models.EmailField(unique=True)
    join_date = models.DateTimeField(auto_now_add=True)

    # Gives us access to authentication
    objects = UserManager()

    # magic variable. See auth docs.
    USERNAME_FIELD = 'email'

    def __unicode__(self):
        return "%s(User#%s)" % (self.email, self.pk)

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    twitter = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        if self.twitter and not self.twitter.startswith('@'):
            self.twitter = '@%s' % self.twitter

        super(Profile, self).save(*args, **kwargs)

    def __unicode__(self):
        return "%s %s (User #%s)" % (self.first_name, self.last_name, self.user.pk)
