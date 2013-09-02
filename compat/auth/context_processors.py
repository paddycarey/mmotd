# third party imports
from google.appengine.api import users


def logout_url(request):
    return {'logout_url': users.create_logout_url('/')}
