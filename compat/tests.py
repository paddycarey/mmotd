# stdlib imports
import unittest

# third-party imports
from google.appengine.ext import testbed


class NdbTestCase(unittest.TestCase):
    """
    Setup and teardown common to tests run using the appengine SDK
    """

    def setUp(self):
        # init testbed so we can use stubs to simulate the sandboxed
        # environment
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        # INIT ALL THE STUBS!
        self.testbed.init_all_stubs()

    def tearDown(self):
        # clean up the testbed after each test is run
        self.testbed.deactivate()
