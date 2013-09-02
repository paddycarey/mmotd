"""
A collection of useful view decorators
"""
# stdlib imports
import json

# third-party imports
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.template import loader
from google.appengine.api import users


def login_required(func):
    """
    Decorator that forces a login via appengine's user service, redirecting to a login
    """
    def _wrapper(request, *args, **kw):
        # check if the user's logged in
        user = users.get_current_user()
        if user:
            request.user = user
            return func(request, *args, **kw)
        else:
            request.session['redirect-after-login'] = request.get_full_path()
            return HttpResponseRedirect(reverse('awwm-login'))

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


def render_with_template(template_name):
    """
    Decorator that renders the decorated function with the given template.
    """

    def _method_wrapper(view_method):

        def _arguments_wrapper(request, *args, **kwargs) :
            """
            Wrapper with arguments to invoke the method
            """

            context = view_method(request, *args, **kwargs)
            if issubclass(type(context), HttpResponse):
                return context
            template = loader.get_template(template_name)
            response = template.render(RequestContext(request, context))
            return HttpResponse(response)

        return _arguments_wrapper

    return _method_wrapper


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
