# third party imports
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.template import loader


def login_required(func):
    """
    Decorator that, when used in conjunction with our custom session middleware
    forces a login via appengine's user service, redirecting first to the login
    page, and back to the desired page upon succesful login
    """

    def _wrapper(request, *args, **kw):

        # check if the user's logged in
        if request.user:
            return func(request, *args, **kw)

        # redirect to login page after storing current url in session
        request.session['redirect-after-login'] = request.get_full_path()
        return HttpResponseRedirect(reverse('template-unauthed-splash'))

    return _wrapper


def render_with_template(template_name):
    """
    Decorator that renders the decorated function with the given template.
    """

    def _method_wrapper(view_method):

        def _arguments_wrapper(request, *args, **kwargs) :

            # call the view function
            context = view_method(request, *args, **kwargs)

            # if the view has returned a HttpResponse or subclass then return
            # that directly
            if issubclass(type(context), HttpResponse):
                return context

            # load specified template and render it with the context
            template = loader.get_template(template_name)
            response = template.render(RequestContext(request, context))
            return HttpResponse(response)

        return _arguments_wrapper

    return _method_wrapper
