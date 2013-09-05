"""
Synchronous AJAX handlers
"""
# third-party imports
from google.appengine.api import channel

# local imports
from mmotd.models.games import Game
from mmotd.views.api.decorators import login_required
from mmotd.views.api.decorators import render_as_json
from mmotd.views.api.decorators import require_methods
from mmotd.views.api.exceptions import Http403


@login_required
@render_as_json
def token_view(request):
    """
    Retrieve a channel API token that a client can use to connect to a socket
    """
    token = channel.create_channel(request.user.user_id())
    return {'token': token}


@login_required
@require_methods('POST')
@render_as_json
def game_view(request, game_id=None):
    """
    Simple POST handler for managing games (should probably replace with
    django-rest-framework later)
    """

    if game_id is not None:
        # join game
        game = Game.get_or_404(game_id)
        if game.add_player(request.user.user_id()):
            return game.to_dict()
        raise Http403
    else:
        # create new game
        max_players = request.POST.get('max_players', Game.max_players._default)
        game = Game(players=[request.user.user_id()], max_players=int(max_players))
        game.put()
        return game.to_dict()
