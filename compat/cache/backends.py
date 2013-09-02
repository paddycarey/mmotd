"""
Custom memcache backend that uses appengine's memcache service
"""
# third-party imports
from django.core.cache.backends.memcached import BaseMemcachedCache
from google.appengine.api import memcache


class AppengineMemcacheCache(BaseMemcachedCache):

    """
    An implementation of a cache binding using appengine's memcache service
    """

    def __init__(self, server, params):
        super(AppengineMemcacheCache, self).__init__(
            server,
            params,
            library=memcache,
            value_not_found_exception=ValueError
        )
