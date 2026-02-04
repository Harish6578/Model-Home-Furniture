from django.urls import path

from .views import UserRegisterView,UserLoginView

# Password Reset

from .views import sent_otp_mail

urlpatterns=[
    path('register/',UserRegisterView.as_view(),name='signup'),
    path('login/',UserLoginView.as_view(),name='signin'),
    path('send-otp/',sent_otp_mail,name='send_otp')
]