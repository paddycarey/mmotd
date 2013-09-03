# stdlib imports
import datetime

# third-party imports
from django.http import Http404
from google.appengine.ext import ndb


class ChatMessage(ndb.Model):
    """Stores a chat message so they can be replayed if needed"""

    created = ndb.DateTimeProperty(auto_now_add=True)
    game_id = ndb.StringProperty(required=True)
    message = ndb.JsonProperty(compressed=True, required=True)


class Player(ndb.Model):
    """Embedded player details stored alongside Game model"""

    joined = ndb.DateTimeProperty(required=True)
    user_id = ndb.StringProperty(required=True)
    nickname = ndb.StringProperty(required=True)
    ready = ndb.BooleanProperty(default=False)


class Game(ndb.Model):

    # timestamps
    created = ndb.DateTimeProperty(auto_now_add=True)
    started = ndb.DateTimeProperty()
    finished = ndb.DateTimeProperty()

    # name and owner of the game
    creator_id = ndb.StringProperty(required=True)
    name = ndb.StringProperty(required=True)

    # max number of players allowed in game
    max_players = ndb.IntegerProperty(default=4)
    # list of Player objects, one for each player in the game
    players = ndb.StructuredProperty(Player, repeated=True)

    def add_player(self, user_id, nickname=None):
        """Adds a player to the game"""
        # check if user is already in this game
        if user_id in [x.user_id for x in self.players]:
            return True
        # check if this game is full
        if len(self.players) > self.max_players:
            return False
        # add player to the game and save
        player = Player(joined=datetime.datetime.utcnow(),
                        user_id=user_id,
                        nickname=nickname or user_id)
        self.players.append(player)
        self.put()
        return True

    def remove_player(self, user_id):
        """Removes a player from the game"""
        index = [x.user_id for x in self.players].index(user_id)
        del self.players[index]
        self.put()

    def replay_messages(self):
        return ChatMessage.replay_messages_for_game(self.key)

    @classmethod
    def get_active_games(cls):
        query = cls.query().order(-cls.created)
        return query

    @classmethod
    def get_or_404(cls, game_id):
        game = cls.get_by_id(int(game_id))
        if game is None:
            raise Http404
        return game
