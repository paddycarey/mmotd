# local imports
from config.settings.base import *

# we use django_nose as our test runner
INSTALLED_APPS += ('django_nose',)
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
NOSE_ARGS = ['--verbosity=1', '--nologcapture', '--with-cover', '--cover-package=mmotd,compat', '--cover-inclusive', '--cover-erase']
