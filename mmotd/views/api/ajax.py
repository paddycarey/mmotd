"""
Synchronous AJAX handlers
"""
# third-party imports
from google.appengine.api import channel

# local imports
from mmotd.views.api.decorators import login_required
from mmotd.views.api.decorators import render_as_json


@login_required
@render_as_json
def token_view(request):
    """
    Retrieve a channel API token that a client can use to connect to a socket
    """
    token = channel.create_channel(request.user.user_id())
    return {'token': token}
