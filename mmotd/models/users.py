# third-party imports
from google.appengine.ext import ndb

# local imports
from mmotd.utils.gravatar import gravatar


class User(ndb.Model):

    """
    Models a game user, this is the objects key should be the user's unique
    google id as obtained via the users service
    """

    # required attributes
    nickname = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)

    @property
    def gravatar(self):
        return gravatar(self.email)

    @classmethod
    def get_or_insert_for_user(cls, appengine_user):
        return cls.get_or_insert(
            appengine_user.user_id(),
            nickname=appengine_user.email(),
            email=appengine_user.email(),
        )
