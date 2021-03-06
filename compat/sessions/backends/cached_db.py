from django.conf import settings
from django.core.cache import cache

from compat.sessions.backends.db import SessionStore as DBStore

KEY_PREFIX = "compat.sessions.cached_db"

class SessionStore(DBStore):

    def __init__(self, session_key=None):
        super(SessionStore, self).__init__(session_key)

    @property
    def cache_key(self):
        """ Create a unique key for cache using the actual session key with a PREFIX
            Calls _get_or_create_session_key to ensure session key is not None
        """
        return KEY_PREFIX + self._get_or_create_session_key()

    def load(self):
        data = cache.get(self.cache_key, None)
        if data is None:
            data = super(SessionStore, self).load()
            cache.set(self.cache_key, data, settings.SESSION_COOKIE_AGE)
        return data

    def exists(self, session_key):
        return super(SessionStore, self).exists(session_key)

    def save(self, must_create=False):
        super(SessionStore, self).save(must_create)
        cache.set(self.cache_key, self._session, settings.SESSION_COOKIE_AGE)

    def delete(self, session_key=None):
        super(SessionStore, self).delete(session_key)
        if session_key is None:
            if self.session_key is None:
                return
            session_key = self.session_key
        cache.delete(KEY_PREFIX + session_key)

    def flush(self):
        self.clear()
        self.delete(self.session_key)
        self.create()
