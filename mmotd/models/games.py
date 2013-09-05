# stdlib imports
import logging

# third-party imports
from mmotd.views.api.exceptions import Http404
from google.appengine.ext import ndb


class Game(ndb.Model):

    # timestamps
    created = ndb.DateTimeProperty(auto_now_add=True)

    # max number of players allowed in game
    max_players = ndb.IntegerProperty(default=4)
    # list of player ids, one for each player in the game
    players = ndb.StringProperty(repeated=True)

    def add_player(self, user_id):
        """Adds a player to the game"""
        # check if user is already in this game
        if user_id in self.players:
            return True
        # check if this game is full
        if len(self.players) >= self.max_players:
            return False
        # add player to the game and save
        self.players.append(user_id)
        self.put()
        return True

    def remove_player(self, user_id):
        """Removes a player from the game"""
        try:
            del self.players[self.players.index(user_id)]
        except KeyError:
            logging.debug('Unable to delete player from game: %s' % user_id)
            pass
        self.put()

    def to_dict(self):
        return {
            'id': self.key.id(),
            'created': self.created.isoformat(),
            'max_players': self.max_players,
            'players': self.players,
        }

    @classmethod
    def get_or_404(cls, game_id):
        game = cls.get_by_id(int(game_id))
        if game is None:
            raise Http404
        return game
