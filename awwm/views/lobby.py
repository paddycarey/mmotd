"""
Lobby/Pregame views and related functions
"""
# stdlib imports
import datetime
import json
import logging

# third-party imports
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from google.appengine.api import channel
from google.appengine.api import taskqueue

# local imports
from awwm.forms import GameForm
from awwm.models.games import ChatMessage
from awwm.models.games import Game
from awwm.models.games import Player
from awwm.models.users import User
from awwm.views.decorators import login_required
from awwm.views.decorators import render_as_json
from awwm.views.decorators import render_with_template
from awwm.views.decorators import require_methods


@login_required
@render_with_template('awwm/lobby.html')
def lobby_view(request):
    return {'active_games': Game.get_active_games()}


@login_required
@render_with_template('awwm/pregame.html')
def pregame_view(request, game_id):
    # get game from datastore or throw 404
    game = Game.get_or_404(game_id)
    # attempt to add the current user to the game if it's not already full
    if not game.add_player(request.user):
        # add a flash message and redirect the user back to the lobby
        return HttpResponseRedirect(reverse('awwm-lobby'))
    token = channel.create_channel(request.user.user_id() + game_id)
    return {'game': game, 'timestamp': datetime.datetime.utcnow().strftime('%H:%M:%S'), 'token': token}


@login_required
@render_with_template('awwm/newgame.html')
def newgame_view(request):
    """
    Form that allows creation of a new game in the lobby
    """

    form = GameForm()
    # check if this is a POST request and if so validate and store the project
    if request.method == 'POST':
        form = GameForm(request.POST)
        if form.is_valid():
            new_game = Game(name=form.cleaned_data['name'], creator=User.get_or_insert_for_user(request.user).key)
            new_game.put()
            return HttpResponseRedirect(reverse('awwm-pregame', args=(new_game.key.id(),)))

    return {'form': form}


@csrf_exempt
@require_methods(['POST'])
@login_required
@render_as_json
def pregame_chat_view(request, game_id):

    # get game from datastore or throw 404
    game = Game.get_or_404(game_id)

    # ensure player sending the message is actually in this game
    active_users = [x.user.id() for x in game.active_players]
    if not request.user.user_id() in active_users:
        return HttpResponse('{"error": "Unauthorised"}', content_type="application/json", status=403)

    # validate the message and clean it up a bit before we send it anywhere
    message = json.loads(request.body)
    if not 'message' in message or not 'nickname' in message:
        return HttpResponse('{"error": "bad request"}', content_type="application/json", status=400)
    # if the message validates then fix up the timestamp if we need to
    message['timestamp'] = datetime.datetime.utcnow().strftime('%H:%M:%S')
    # we need to wrap our message to make sure our callback handler can route it properly
    message = {'msgtype': 'chat', 'msgcontent': message}

    # send the message to all players in the game except the sender
    for player in game.active_players:
        channel.send_message(player.user_id + game_id, json.dumps(message))

    ChatMessage.store_message(game_key=game.key, message_json=message)

    # return some kind of response to the sender
    return {'result': 'success'}


@csrf_exempt
@require_methods(['POST'])
@login_required
@render_as_json
def pregame_status_update_view(request, game_id):

    # get game from datastore or throw 404
    game = Game.get_or_404(game_id)

    # ensure player sending the message is actually in this game
    active_users = [x.user.id() for x in game.active_players]
    if not request.user.user_id() in active_users:
        return HttpResponse('{"error": "Unauthorised"}', content_type="application/json", status=403)

    # validate the message and clean it up a bit before we send it anywhere
    message = json.loads(request.body)
    if not 'status' in message or not isinstance(message['status'], bool):
        logging.info(message)
        return HttpResponse('{"error": "bad request"}', content_type="application/json", status=400)
    # we need to wrap our message to make sure our callback handler can route it properly
    message['user_id'] = request.user.user_id()
    message = {'msgtype': 'status_update', 'msgcontent': message}

    player = Player.get_or_insert(game.key, User.get_by_id(request.user.user_id()).key)
    player.ready = message['msgcontent']['status']
    player.put()

    # send the message to all players in the game except the sender
    for player in game.active_players:
        channel.send_message(player.user_id + game_id, json.dumps(message))

    # return some kind of response to the sender
    return {'result': 'success'}


@csrf_exempt
@require_methods(['POST'])
@login_required
@render_as_json
def pregame_replay_chat_view(request, game_id):

    # get game from datastore or throw 404
    game = Game.get_or_404(game_id)

    # ensure player sending the message is actually in this game
    active_users = [x.user.id() for x in game.active_players]
    if not request.user.user_id() in active_users:
        return HttpResponse('{"error": "Unauthorised"}', content_type="application/json", status=403)

    # validate the message and clean it up a bit before we send it anywhere
    message = json.loads(request.body)
    if not 'replay_chat' in message or not isinstance(message['replay_chat'], bool):
        logging.info(message)
        return HttpResponse('{"error": "bad request"}', content_type="application/json", status=400)

    # run background task to do the hard work
    taskqueue.add(url=reverse('awwm-async-replay-chat'), params={'game_id': game_id, 'user_id': request.user.user_id()})

    # return some kind of response to the sender
    return {'result': 'success'}
