from django.shortcuts import render, redirect
from django.contrib.auth import(
    authenticate as django_authenticate,
    login as django_login
)
from django.contrib.auth.decorators import login_required

from rest_framework.viewsets import ModelViewSet

from apps.utils.view_helpers import render_form_errors

import serializers as acct_ser
import models as acct_models
import forms as acct_forms

from django.contrib.auth import get_user_model
from django.views.decorators.http import require_POST

import urllib
import hashlib

def gravatar_url(email, size=100):
    # construct the url
    gravatar_url = "http://www.gravatar.com/avatar/" + hashlib.md5(email.lower()).hexdigest() + "?"
    gravatar_url += urllib.urlencode({'s':str(size)})
    return gravatar_url

#################
# API Viewsets
#################
class UserViewSet(ModelViewSet):
    serializer_class = acct_ser.UserSerializer
    model = get_user_model()

class ProfileViewSet(ModelViewSet):
    serializer_class = acct_ser.ProfileSerializer
    model = acct_models.Profile

#################
# Normal views
#################

@login_required
def main(request):
    context = {
        "title": "Groops list",
        'gravatar_url': gravatar_url(request.user.email)
    }
    return render(request, "account/main.html", context)

def intro(request):
    context = {
        'title': 'Groops'
    }
    return render(request, "account/intro.html", context)

@require_POST
def register(request):
    form = acct_forms.NewUserForm(request.POST)

    if not form.is_valid():
        return render_form_errors(request, 'User creation failed', form)

    data = form.data
    user = acct_ser.UserSerializer(data={
        'email': data['email']
    })

    if not user.is_valid():
        return render_form_errors(request, 'User creation failed', user)

    user = user.save()

    user.set_password(data['password'])
    user.save()

    # Calling myelf out: extremely bad practice here!
    # http://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/
    first_name, last_name = data['name'].split(' ')

    profile = acct_ser.ProfileSerializer(data={
        'user':user,
        'first_name': first_name,
        'last_name': last_name,
        'twitter': data['twitter']
    })

    if not profile.is_valid():
        return render_form_errors(request, 'Profile creation failed', profile)

    profile = profile.save()
    django_login(request, user)
    return redirect('main')

def login(request):
    context = {
        'title': 'Login'
    }
    return render(request, "account/login.html", context)

@require_POST
def authenticate(request):
    form = acct_forms.LoginForm(request.POST)

    if not form.is_valid():
        return render_form_errors(request, 'Authentication failed', form)

    data = form.data
    user = django_authenticate(username=data['email'], password=data['password'])

    if user is None:
        return render(request, "global/error.html", {
            'message': 'Authentication failed',
            'error': 'Invalid email/password combination'
        })
    else:
        context = {
            'title': 'Groops List'
        }
        django_login(request, user)
        return redirect('main')
