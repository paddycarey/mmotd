"""
All channel related views go in here
"""
# third-party imports
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# local imports
from mmotd.utils.channel_api import send_message


@csrf_exempt
def channel_relay(request):

    """
    Simply relays a message via the channel API to the given client
    """

    # get message details from post data
    token = request.POST['token']
    message = request.POST['message']
    # send channel message
    send_message(token, message)
    return HttpResponse('channel messages relayed')
