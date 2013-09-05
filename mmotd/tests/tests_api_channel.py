# stdlib imports
import json

# third-party imports
from django.core.urlresolvers import reverse
from django.test.client import Client

# local imports
from compat.tests import NdbTestCase


class ChannelRelayTests(NdbTestCase):

    def setUp(self):
        super(ChannelRelayTests, self).setUp()
        # init a django test client
        self.c = Client()

    def test_send_messages(self):

        channel_tokens = []

        # make create request and parse response
        self.testbed.setup_env(USER_EMAIL = 'a@a.aa', USER_ID = '1000000', overwrite = True)
        response = self.c.post(reverse('api-ajax-game'))
        game_id = json.loads(response.content)['id']
        # connect to a channel
        channel_response = self.c.get(reverse('api-ajax-token'))
        channel_tokens.append(json.loads(channel_response.content)['token'])

        for x in xrange(3):
            # switch user accounts
            self.testbed.setup_env(USER_EMAIL = '%d@a.aa' % (x + 1), USER_ID = str(x + 1), overwrite = True)
            # make join request and parse response
            self.c.post(reverse('api-ajax-game', kwargs={'game_id': game_id}))
            # connect to a channel
            channel_response = self.c.get(reverse('api-ajax-token'))
            channel_tokens.append(json.loads(channel_response.content)['token'])


        # send a message down the channel
        response = self.c.post(reverse('api-channel-game-relay', kwargs={'game_id': game_id}), json.dumps({'test': 'Hello!'}), content_type='application/json')
        channel_stub = self.testbed.get_stub('channel')
        # assert yo'self!
        # for token in channel_tokens:
            # self.assertTrue(channel_stub.has_channel_messages(token))
            # self.assertTrue(channel_stub.get_channel_messages), 1)
