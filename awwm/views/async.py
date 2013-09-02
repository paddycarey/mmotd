"""
Lobby/Pregame views and related functions
"""
# stdlib imports
import json
import logging

# third-party imports
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from google.appengine.api import channel

# local imports
from awwm.models.games import Game
from awwm.models.games import Player
from awwm.models.games_utils import replay_chat_messages
from awwm.models.users import User
from awwm.views.decorators import require_methods


@csrf_exempt
@require_methods(['POST'])
def replay_chat(request):

    # get game from datastore or throw 404
    game = Game.get_by_id_async(int(request.POST['game_id']))
    user = User.get_by_id_async(request.POST['user_id'])

    # ensure this player is actually in the game before replaying
    game_key = game.get_result().key
    user_key = user.get_result().key
    player_id = Player.build_key(game_key, user_key)
    if not Player.get_by_id(player_id):
        message = 'Skipping replay: Player not in game'
        logging.warning(message)
        return HttpResponse(message)

    # replay the chat via the channel api to the specified user
    replay_chat_messages(game_key, user_key)

    # return some kind of response to the sender
    return HttpResponse('Chat replayed')
