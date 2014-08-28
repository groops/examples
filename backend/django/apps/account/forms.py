from django import forms

class NewUserForm(forms.Form):
    name = forms.CharField()
    email = forms.EmailField()
    password = forms.CharField()
    twitter = forms.CharField(required=False)

class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField()
