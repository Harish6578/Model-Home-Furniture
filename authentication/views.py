from django.shortcuts import render
from django.urls import reverse_lazy

# Using the built-in auth app User model
from django.contrib.auth.models import User 

# extending the auth views
from django.contrib.auth.views import (
    LoginView
)
# CreateView CBV
from django.views.generic import CreateView

from .forms import UserRegisterForm, UserLoginForm

from django.contrib.auth import login

# Create your views here.

class UserRegisterView(CreateView):
    model = User 
    form_class = UserRegisterForm
    template_name = 'authentication/register.html'
    success_url = reverse_lazy('signin')


class UserLoginView(LoginView):
    template_name = 'authentication/login.html'
    authentication_form = UserLoginForm