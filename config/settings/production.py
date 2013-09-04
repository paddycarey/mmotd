"""
Production environment settings
"""
# local imports
from config.settings.base import *


# set debug to false in production
DEBUG = False
TEMPLATE_DEBUG = DEBUG

# use cached template loader in production
TEMPLATE_LOADERS = (
    ('django.template.loaders.cached.Loader', TEMPLATE_LOADERS),
)

# SECRET_KEY = None
