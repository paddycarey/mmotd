# third-party imports
from django.http import Http404
from google.appengine.ext import ndb

# local imports
from mmotd.models.users import User


class ChatMessage(ndb.Model):

    created = ndb.DateTimeProperty(auto_now_add=True)
    game = ndb.KeyProperty(required=True)
    message = ndb.JsonProperty(required=True)

    @classmethod
    def store_message(cls, game_key, message_json):
        cm = cls(game=game_key, message=message_json)
        cm.put()
        return cm

    @classmethod
    def replay_messages_for_game(cls, game_key):
        q = cls.query().filter(cls.game==game_key)
        q = q.order(cls.created)
        return q


class Player(ndb.Model):
    """
    A user could be in multiple games at the same time (not necessarily active
    in each one, but that's irrelevant) so we use this proxy model to create a
    pseudo many-to-many.
    """

    joined = ndb.DateTimeProperty(auto_now_add=True)
    game = ndb.KeyProperty(required=True)
    user = ndb.KeyProperty(required=True)
    ready = ndb.BooleanProperty(default=False)

    @property
    def email(self):
        return self.user.get().email

    @property
    def gravatar(self):
        return self.user.get().gravatar

    @property
    def nickname(self):
        return self.user.get().nickname

    @property
    def user_id(self):
        return self.user.id()

    @classmethod
    def build_key(cls, game_key, user_key):
        return str(user_key.id()) + '-' + str(game_key.id())

    @classmethod
    def get_or_insert(cls, game_key, user_key):
        return super(Player, cls).get_or_insert(
            cls.build_key(game_key, user_key),
            game=game_key,
            user=user_key,
        )


class Game(ndb.Model):

    created = ndb.DateTimeProperty(auto_now_add=True)
    creator = ndb.KeyProperty(required=True)
    name = ndb.StringProperty(required=True)
    max_players = ndb.IntegerProperty(default=4)
    players = ndb.KeyProperty(repeated=True)
    started = ndb.BooleanProperty(default=False)
    welcome_message = ndb.StringProperty(default='Welcome to my game!')

    @property
    def active_players(self):
        return [x.get_result() for x in ndb.get_multi_async(self.players)]

    def add_player(self, appengine_user):
        """
        Adds a player to the game, accepts a users.User object, returns the newly created player object
        """
        user = User.get_or_insert_for_user(appengine_user)
        player = Player.get_or_insert(self.key, user.key)
        if not player.key in self.players:
            if len(self.players) > self.max_players:
                player.key.delete()
                return False
            self.players.append(player.key)
            self.put()
        return True

    def remove_player(self, appengine_user):
        """
        Removes a player from the game, accepts a users.User object, returns None
        """
        user = User.get_or_insert_for_user(appengine_user)
        player = Player.get_by_id(Player.build_key(self.key, user.key))
        self.players.remove(player.key)
        player.key.delete()
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
