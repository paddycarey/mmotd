"""
Custom auth middleware that uses appengine's users service to authenticate
users with their google accounts.
"""
# third-party imports
from django.utils.functional import SimpleLazyObject
from google.appengine.api import users


def get_user(request):
    if not hasattr(request, '_cached_user'):
        request._cached_user = users.get_current_user()
    return request._cached_user


def get_superuser_status(request):
    if not hasattr(request, '_cached_superuser_status'):
        request._cached_superuser_status = users.is_current_user_admin()
    return request._cached_superuser_status


class AppengineAuthenticationMiddleware(object):

    def process_request(self, request):
        request.user = SimpleLazyObject(lambda: get_user(request))
        request.is_superuser = SimpleLazyObject(lambda: get_superuser_status(request))
