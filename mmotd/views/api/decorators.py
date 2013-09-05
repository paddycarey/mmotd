"""
A collection of useful view decorators
"""
# stdlib imports
import json

# third-party imports
from django.http import HttpResponse

# local imports
from mmotd.views.api.exceptions import HttpException


def login_required(func):
    """
    Decorator that, when used in conjunction with our custom session middleware
    returns a 401 response if the user is not logged in. Clients should use
    this response to inform a client that they need to reauthenticate.
    """

    def _wrapper(request, *args, **kw):

        # check if the user's logged in
        if request.user:
            return func(request, *args, **kw)

        # build and return response
        msg = '{"error": "401 Unauthorized"}'
        return HttpResponse(msg, content_type="application/json", status=401)

    return _wrapper


def render_as_json(view_method):

    def _arguments_wrapper(request, *args, **kwargs) :
        """
        Wrapper with arguments to invoke the method
        """

        try:
            context = view_method(request, *args, **kwargs)
            status = 200
        except HttpException as e:
            context = {'error': "%d %s" % (e.status, e.reason)}
            status = e.status
        return HttpResponse(json.dumps(context), content_type="application/json", status=status)

    return _arguments_wrapper


def require_methods(methods):
    """
    Decorator that checks that a request contains the specified header
    """
    def _method_wrapper(view_method):
        def _arguments_wrapper(request, *args, **kwargs) :

            # check method is allowed
            if request.method in methods:
                return view_method(request, *args, **kwargs)

            # otherwise build and return a 405 response
            msg = '{"error": "Method Not Allowed"}'
            return HttpResponse(msg, content_type="application/json", status=405)
        return _arguments_wrapper
    return _method_wrapper
