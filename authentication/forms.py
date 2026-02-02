from django import forms
from django.contrib.auth.forms import(
    UserCreationForm,AuthenticationForm
)
from django.contrib.auth.models import User

#appling same attributes for all form field

BOOTSTARP_ATTPS ={
    'class':'form-control'
}
class UserRegisterForm(UserCreationForm):
    username=forms.CharField(widget=forms.TextInput(attrs=BOOTSTARP_ATTPS))
    email=forms.EmailField(widget=forms.EmailInput(attrs=BOOTSTARP_ATTPS))
    password1=forms.CharField(widget=forms.PasswordInput(attrs=BOOTSTARP_ATTPS))
    password2=forms.CharField(widget=forms.PasswordInput(attrs=BOOTSTARP_ATTPS))

    class Meta:
        model=User
        fields=[
            'username','email','password1','password2'
        ]

    def clean_email(self):
        email=self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists!")
        return email
    


class UserLoginForm(AuthenticationForm):
    username =forms.CharField(
        widget=forms.TextInput(attrs=BOOTSTARP_ATTPS)
    )
    password =forms.CharField(
        widget=forms.PasswordInput(attrs=BOOTSTARP_ATTPS)
    )