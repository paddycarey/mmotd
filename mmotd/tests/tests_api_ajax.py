# stdlib imports
import json

# third-party imports
from django.core.urlresolvers import reverse
from django.test.client import Client

# local imports
from compat.tests import NdbTestCase


class AjaxTokenApiTests(NdbTestCase):

    def setUp(self):
        super(AjaxTokenApiTests, self).setUp()
        # init a django test client
        self.c = Client()

    def test_get_token_unauthed(self):
        response = self.c.get(reverse('api-ajax-token'))
        response_dict = json.loads(response.content)
        # assert all the things
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response_dict)
        self.assertEqual(response_dict['error'], '401 Unauthorized')

    def test_get_token_authed(self):
        # log in a fake user
        self.testbed.setup_env(USER_EMAIL = 'a@a.com', USER_ID = '123', overwrite = True)
        response = self.c.get(reverse('api-ajax-token'))
        response_dict = json.loads(response.content)
        # assert all the things
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response_dict)


class AjaxGameApiTests(NdbTestCase):

    def setUp(self):
        super(AjaxGameApiTests, self).setUp()
        # log in as user
        self.testbed.setup_env(
            USER_EMAIL = 'test@example.com',
            USER_ID = '123',
            USER_IS_ADMIN = '1',
            overwrite = True
        )
        # init a django test client
        self.c = Client()

    def test_create_game_default_opts(self):
        """Create a game with default options (no body)"""
        # make create request and parse response
        response = self.c.post(reverse('api-ajax-game'))
        response_dict = json.loads(response.content)
        # make some assertions yo!
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict['players'], ['123'])
        self.assertEqual(response_dict['max_players'], 4)

    def test_create_game_and_add_a_second_player(self):
        """Create a game and add a second player"""
        # make create request and parse response
        response = self.c.post(reverse('api-ajax-game'))
        response_dict = json.loads(response.content)
        # switch user accounts
        self.testbed.setup_env(
            USER_EMAIL = 'anotheruser@example.com',
            USER_ID = '456',
            USER_IS_ADMIN = '1',
            overwrite = True
        )
        # make join request and parse response
        game_id = response_dict['id']
        response = self.c.post(reverse('api-ajax-game', kwargs={'game_id': game_id}))
        response_dict = json.loads(response.content)
        # make some assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict['players'], ['123', '456'])
        self.assertEqual(response_dict['max_players'], 4)

    def test_create_game_and_add_too_many_players(self):
        """Create a game and add too many players"""
        # make create request and parse response
        response = self.c.post(reverse('api-ajax-game'), {'max_players': 2})
        response_dict = json.loads(response.content)
        # switch user accounts
        self.testbed.setup_env(
            USER_EMAIL = 'anotheruser@example.com',
            USER_ID = '456',
            USER_IS_ADMIN = '1',
            overwrite = True
        )
        # make join request and parse response
        game_id = response_dict['id']
        response = self.c.post(reverse('api-ajax-game', kwargs={'game_id': game_id}))
        # switch user accounts
        self.testbed.setup_env(
            USER_EMAIL = 'yetanotheruser@example.com',
            USER_ID = '789',
            USER_IS_ADMIN = '1',
            overwrite = True
        )
        # make join request and parse response
        response = self.c.post(reverse('api-ajax-game', kwargs={'game_id': game_id}))
        response_dict = json.loads(response.content)
        # make some assertions
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response_dict['error'], '403 Forbidden')
