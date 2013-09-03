"""
Django settings for djappengine project.
"""
# stdlib imports
import os

# get the app's path so we can use it in other places
THIS_DIR = os.path.abspath(os.path.dirname(__file__))
ROOT_PATH = os.path.normpath(os.path.join(THIS_DIR, os.pardir, os.pardir))

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['*']

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = None

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-gb'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Make this unique, and don't share it with anybody.
# THIS IS ONLY FOR DEV AND SHOULD ******NEVER******* BE DEPLOYED TO PRODUCTION
SECRET_KEY = 'ukgbg0#uxk=q5m%3*ob3!qjm0thzjc==yeus#-9-8gz@a=^5_u'

ROOT_URLCONF = 'config.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'config.wsgi.application'

INSTALLED_APPS = (
    # built-in apps

    'django.contrib.sessions',
    'django.contrib.messages',
    # third-party apps
    'floppyforms',
    # 'raven.contrib.django.raven_compat',
    # local apps
    'mmotd',
    'compat.sessions',

)


# A custom cache backend using AppEngine's memcached
CACHES = {
    'default': {
        'BACKEND': 'compat.cache.backends.AppengineMemcacheCache',
    }
}

# SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_ENGINE = "compat.sessions.backends.cached_db"
EMAIL_BACKEND = 'compat.mail.backends.sync.EmailBackend'
# SESSION_SAVE_EVERY_REQUEST = True

# RAVEN_CONFIG = {
#     'dsn': '',
# }
# SENTRY_DEBUG = True

#######################################################
# Middleware configuration (remember: order matters!) #
#######################################################

MIDDLEWARE_CLASSES = (
    # ye olde profiler
    'google.appengine.ext.appstats.recording.AppStatsDjangoMiddleware',
    # makes NDB play nicely with other middleware (and django in general)
    'google.appengine.ext.ndb.django_middleware.NdbDjangoMiddleware',
    'django.middleware.common.CommonMiddleware',
    # custom auth middleware using the appengine users service
    'compat.auth.middleware.AppengineAuthenticationMiddleware',
    # custom session middleware that uses Ndb as the backing store
    # TODO: replace with the one from Potato's djappengine
    'compat.sessions.middleware.SessionMiddleware',
    # handles temporary messages
    'django.contrib.messages.middleware.MessageMiddleware',
    # because security yo!
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)


##########################################################
# Template related settings (loaders, directories, etc.) #
##########################################################

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

# Directories in which the filesystem TEMPLATE_LOADER will look for templates
TEMPLATE_DIRS = (
    os.path.join(ROOT_PATH, 'templates'),
)

# List of processors used by RequestContext to populate the context.
# Each one should be a callable that takes the request object as its
# only parameter and returns a dictionary to add to the context.
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
    'compat.auth.context_processors.logout_url',
)

#########################
# Logging configuration #
#########################

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
