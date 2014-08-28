from django.test import TestCase

from apps.account import models as acct_models
from apps.account import serializers as acct_ser

from apps.chat import models as chat_models
from apps.chat import serializers as chat_ser

class ChatModelTests(TestCase):
    def test_room_automatic_slug(self):
        user = acct_ser.UserSerializer(data={
            'email':'joe@example.com'
        }).quicksave()

        room = chat_ser.RoomSerializer(data={
                'creator':user,
                'name':'The Best Room',
        }).quicksave()

        self.assertIsNotNone(room.slug)

    def test_join_room(self):
        user = acct_ser.UserSerializer(data={
            'email':'joe@example.com',
        }).quicksave()

        room = chat_ser.RoomSerializer(data={
                'creator':user,
                'name':'The Best Room',
        }).quicksave()

        session = user.join_room(room)
        connected_date = session.connected_date

        self.assertEqual(chat_models.ChatSession.objects.all().count(), 1)

        # Joining again shouldn't change anything since we're still in the room.
        session2 = user.join_room(room)
        connected_date2 = session.connected_date

        self.assertEqual(chat_models.ChatSession.objects.all().count(), 1)
        self.assertEqual(connected_date, connected_date2)
        self.assertEqual(session, session2)

        # Disconnect
        session.end()
        self.assertFalse(session.is_active)

        # Rejoining should create a new session
        session3 = user.join_room(room)
        self.assertNotEqual(session.connected_date, session3.connected_date)
        self.assertNotEqual(session, session3)

    def test_active_users(self):
        user = acct_ser.UserSerializer(data={
            'email':'joe@example.com'
        }).quicksave()

        user2 = acct_ser.UserSerializer(data={
            'email':'john@example.com'
        }).quicksave()

        user3 = acct_ser.UserSerializer(data={
            'email':'jack@example.com'
        }).quicksave()

        room = chat_ser.RoomSerializer(data={
                'creator':user,
                'name':'The Best Room',
        }).quicksave()

        session1 = user.join_room(room)
        session2 = user2.join_room(room)
        session3 = user3.join_room(room)

        self.assertEqual(room.active_users, 3)

        session3.end()
        self.assertEqual(room.active_users, 2)

    def test_idempodent_disconnect(self):
        user = acct_ser.UserSerializer(data={
            'email':'john@example.com'
        }).quicksave()

        room = chat_ser.RoomSerializer(data={
                'creator':user,
                'name':'The Best Room',
        }).quicksave()
        session = user.join_room(room)

        disconnect_date = session.end()
        self.assertEqual(disconnect_date, session.end())

    def test_delete_messages(self):
        user = acct_ser.UserSerializer(data={
            'email':'john@example.com'
        }).quicksave()

        room = chat_ser.RoomSerializer(data={
                'creator':user,
                'name':'The Best Room',
        }).quicksave()
        session = user.join_room(room)
