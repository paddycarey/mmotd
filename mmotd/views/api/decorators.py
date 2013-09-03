"""
A collection of useful view decorators
"""
# stdlib imports
import json

# third-party imports
from django.http import HttpResponse



def taskqueue_required(func):
    """
    checks that request has been made by a taskqueue
    """
    def _wrapper(request, *args, **kw):
        # check if the user's logged in
        if request.is_superuser:
            return func(request, *args, **kw)
        else:
            return HttpResponse('Access Denied')
    return _wrapper


def render_as_json(view_method):

    def _arguments_wrapper(request, *args, **kwargs) :
        """
        Wrapper with arguments to invoke the method
        """

        context = view_method(request, *args, **kwargs)
        if issubclass(type(context), HttpResponse):
            return context
        return HttpResponse(json.dumps(context), content_type="application/json")

    return _arguments_wrapper


def require_methods(methods):
    """
    Decorator that checks that a request contains the specified header
    """
    def _method_wrapper(view_method):
        def _arguments_wrapper(request, *args, **kwargs) :
            if request.method in methods:
                return view_method(request, *args, **kwargs)
            else:
                return HttpResponse(
                    '{"error": "Method Not Allowed"}',
                    content_type="application/json",
                    status=405
                )
        return _arguments_wrapper
    return _method_wrapper
