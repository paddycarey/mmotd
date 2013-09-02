# stdlib imports
import logging

# third-party imports
from django.core.mail.backends.base import BaseEmailBackend
from google.appengine.api import mail as aeemail
from google.appengine.runtime import apiproxy_errors

# local imports
from compat.mail.utils import convert_message


class EmailBackend(BaseEmailBackend):

    def send_messages(self, email_messages):

        num_sent = 0
        for message in email_messages:

            try:
                message = convert_message(message)
            except (ValueError, aeemail.InvalidEmailError), err:
                logging.warn(err)
                if not self.fail_silently:
                    raise
                continue

            if self._send(message):
                num_sent += 1

        return num_sent

    def _send(self, message):

        try:
            message.send()
        except (aeemail.Error, apiproxy_errors.Error):
            if not self.fail_silently:
                raise
            return False
        return True
