from django.shortcuts import render, redirect, get_object_or_404
from apps.utils.view_helpers import render_form_errors
from django.views.decorators.http import require_POST
from rest_framework.decorators import action, api_view, link
from rest_framework.response import Response

from django.contrib.auth.decorators import login_required

from rest_framework.viewsets import ModelViewSet
import serializers as chat_ser
import models as chat_models
import forms as chat_forms

class RoomViewSet(ModelViewSet):
    serializer_class = chat_ser.RoomSerializer
    model = chat_models.Room

    @action()
    def message(self, request, pk=None):
        print("WHAT")
        return Response(request.DATA)

class MessageViewSet(ModelViewSet):
    serializer_class = chat_ser.MessageSerializer
    model = chat_models.Message

@require_POST
def create_room(request):
    form = chat_forms.NewRoomForm(request.POST)
    if not form.is_valid():
        return render_form_errors(request, 'Room creation failed', form)

    data = form.data
    room = chat_ser.RoomSerializer(data={
            'creator':request.user,
            'name': data['name'],
    })

    if not room.is_valid():
        return render_room_errors(request, 'Room creation failed', room)

    room = room.save()
    request.user.join_room(room)

    return redirect('room', slug=room.slug)

@login_required
def get_room(request, slug=None):
    room = get_object_or_404(chat_models.Room, slug=slug)
    context = {
        'room': room
    }
    return render(request, 'chat/room.html', context)
