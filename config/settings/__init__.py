"""
Django settings module, loads the correct
settings file depending on the environment
"""
# stdlib imports
import os

# First thing we need to do is check if we're running inside the sandbox. The
# only reason we wouldn't be running inside the sandbox is during a test run,
# so in case we're outside the sandbox we'll load our testing settings.
try:
    # raises an ImportError when in the sandbox
    import pwd
except ImportError:
    # check if we're running locally or in production
    if os.environ['SERVER_SOFTWARE'].startswith('Development'):
        # import local settings
        from config.settings.local import *
    else:
        # import production specific settings
        from config.settings.production import *
else:
    # if we're able to import pwd then we're not in the sandbox
    from config.settings.testing import *
