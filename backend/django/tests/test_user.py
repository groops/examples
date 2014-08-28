from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.account import models as acct_models
from apps.account import serializers as acct_ser

User = get_user_model()

class UserModelTests(TestCase):
    def setUp(self):
        self.user = acct_ser.UserSerializer(data={
            'email':'someuser@example.com'
        }).quicksave()

    def test_profile_twitter_no_at(self):
        profile = acct_ser.ProfileSerializer(data={
            'user':self.user,
            'first_name':'Joe',
            'last_name':'McCullough',
            'twitter':'joe_query'
        }).quicksave()

        self.assertEqual(profile.twitter, '@joe_query')

    def test_profile_twitter_with_at(self):
        profile = acct_models.Profile.objects.create(
            user=self.user,
            first_name='Joe',
            last_name='McCullough',
            twitter='@joe_query'
        )
        self.assertEqual(profile.twitter, '@joe_query')
