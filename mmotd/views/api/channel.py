"""
All channel related views go in here
"""
# third-party imports
from django.http import HttpResponse

# local imports
from mmotd.utils.channel_api import send_message
from mmotd.views.api.decorators import login_required


@login_required
def relay_view(request):

    """
    Simply relays a message via the channel API to the given client
    """

    # get message details from post data
    token = request.POST['token']
    message = request.POST['message']
    # send channel message
    send_message(token, message)
    return HttpResponse('channel messages relayed')
