"""
Auth/Login views
"""
# third-party imports
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from google.appengine.api import users

# local imports
from mmotd.views.decorators import render_with_template


@render_with_template('mmotd/login.html')
def login_view(request):
    """
    Display a login page allowing user to begin process of signing in with
    their google account.
    """

    # pop the redirect url from the session
    next_url = request.session.get('redirect-after-login', reverse('mmotd-lobby'))
    try:
        del request.session['redirect-after-login']
    except KeyError:
        pass

    # if the user's already logged in then we don't need to show them the
    # login page, just send them where they need to go
    if request.user:
        return HttpResponseRedirect(next_url)

    return {'login_url': users.create_login_url(next_url)}
