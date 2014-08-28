from rest_framework import serializers
from apps.utils.model_helpers import ModelSerializer
import models as acct_models

class UserSerializer(ModelSerializer):
    class Meta:
        model = acct_models.User
        fields = ('email', 'join_date',)

class ProfileSerializer(ModelSerializer):
    user = serializers.PrimaryKeyRelatedField()
    class Meta:
        model = acct_models.Profile
