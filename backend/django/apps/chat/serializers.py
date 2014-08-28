from apps.utils.model_helpers import ModelSerializer
import models as chat_models

class RoomSerializer(ModelSerializer):
    class Meta:
        model = chat_models.Room

class ChatSessionSerializer(ModelSerializer):
    class Meta:
        model = chat_models.ChatSession

class MessageSerializer(ModelSerializer):
    class Meta:
        model = chat_models.Message
