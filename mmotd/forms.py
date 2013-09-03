# third-party imports
from django import forms


class GameForm(forms.Form):

    name = forms.CharField(max_length=200)
