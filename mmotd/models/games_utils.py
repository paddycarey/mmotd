# stdlib imports
import json

# third-party imports
from google.appengine.api import channel
from google.appengine.ext import ndb

# local imports
from mmotd.models.games import ChatMessage


def replay_chat_messages(game_key, user_key, limit=50):

    # build query to be iterated over
    qry = ChatMessage.query()
    qry = qry.filter(ChatMessage.game==game_key)
    qry = qry.order(-ChatMessage.created)
    qry = qry.fetch_async(limit, keys_only=True)

    # iterate over query and replay stored chat messages
    msg_count = 0
    for chat_message_future in reversed(ndb.get_multi_async([x for x in qry.get_result()])):
        chat_message = chat_message_future.get_result()
        channel.send_message(user_key.id() + str(game_key.id()), json.dumps(chat_message.message))
        msg_count += 1
    return msg_count
