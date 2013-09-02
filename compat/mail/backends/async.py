# third-party imports
from google.appengine.api import mail as aeemail
from google.appengine.ext import deferred
from google.appengine.runtime import apiproxy_errors
from django.conf import settings

# local imports
from compat.mail.backends.sync import EmailBackend

EMAIL_QUEUE_NAME = getattr(settings, 'EMAIL_QUEUE_NAME', 'default')


def _send_deferred(message, fail_silently=False):
    try:
        message.send()
    except (aeemail.Error, apiproxy_errors.Error):
        if not fail_silently:
            raise


class AsyncEmailBackend(EmailBackend):

    def _send(self, message):
        self._defer_message(message)
        return True

    def _defer_message(self, message):
        deferred.defer(
            _send_deferred,
            message,
            fail_silently=self.fail_silently,
            _queue=EMAIL_QUEUE_NAME
        )
