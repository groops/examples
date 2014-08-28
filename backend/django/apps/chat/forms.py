from django import forms

class NewRoomForm(forms.Form):
    name = forms.CharField()
