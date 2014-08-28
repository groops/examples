from django.conf import settings
from django.db import models
from uuid import uuid4
from django.utils import timezone

######################################################################
# Models
######################################################################
def gen_uuid():
    return uuid4().hex

class Room(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_rooms')
    name = models.CharField(max_length=100, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)
    slug = models.CharField(max_length=50, default=gen_uuid)

    def get_active_sessions(self):
        sessions = self.chat_sessions.filter(disconnected_date__isnull=True)
        return sessions

    @property
    def active_users(self):
        return self.get_active_sessions().count()

    def __unicode__(self):
        return "%s(Room#%s)" % (self.name, self.pk)

class ChatSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chat_sessions')
    room = models.ForeignKey('Room', related_name='chat_sessions')
    connected_date = models.DateTimeField(auto_now_add=True)
    disconnected_date = models.DateTimeField(null=True)

    @property
    def is_active(self):
        return self.disconnected_date is None

    def end(self):
        if self.disconnected_date is None:
            self.disconnected_date = timezone.now()
            self.save()

        return self.disconnected_date

    def __unicode__(self):
        active_str = "(ACTIVE)" if self.is_active else ""
        return "%s:%s%s" % (self.user, self.room, active_str)

class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='messages')
    room = models.ForeignKey('Room', related_name='messages')
    session = models.ForeignKey('ChatSession', related_name='messages')
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        fmt = "User #%s: %s..." % (self.user, self.content[:50])

######################################################################
# Mixins
######################################################################
class UserChatMixin(object):
    '''
    Chat related methods for the user
    '''
    def join_room(self, room):
        try:
            current_session = self.chat_sessions.get(
                room=room,
                disconnected_date__isnull=True
            )
            return current_session
        except ChatSession.DoesNotExist:
            new_session = self.chat_sessions.create(
                room=room
            )
            return new_session
