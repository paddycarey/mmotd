"""
All channel related views go in here
"""
# third-party imports
from django.http import HttpResponse

# local imports
from mmotd.models.games import Game
from mmotd.utils.channel_api import send_message
from mmotd.views.api.decorators import login_required
from mmotd.views.api.decorators import render_as_json
from mmotd.views.api.decorators import require_methods
from mmotd.views.api.exceptions import Http403


@login_required
@require_methods('POST')
@render_as_json
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


@login_required
@require_methods('POST')
@render_as_json
def game_relay_view(request, game_id):
    """
    Simple POST handler for relaying a message to all players in a game
    """

    game = Game.get_or_404(game_id)
    # ensure player sending message is in game
    if not request.user.user_id() in game.players:
        raise Http403
    # relay the message to everyone in the game
    send_message(game.players, request.body)
    return {'success': 'messages relayed'}
