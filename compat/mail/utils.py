# stdlib imports
from email.MIMEBase import MIMEBase

# third-party imports
from django.core.mail import EmailMultiAlternatives
from google.appengine.api import mail


def convert_message(dj_message):
    """
    Creates and returns an appengine EmailMessage class from a Django Email.
    """

    # create appengine class
    ae_message = mail.EmailMessage(sender=dj_message.from_email, to=dj_message.to, subject=dj_message.subject, body=dj_message.body)

    # add optional fields
    if dj_message.extra_headers.get('Reply-To', None):
        ae_message.reply_to = dj_message.extra_headers['Reply-To']
    if dj_message.cc:
        ae_message.cc = list(dj_message.cc)
    if dj_message.bcc:
        ae_message.bcc = list(dj_message.bcc)

    # check if any attachments are present
    if dj_message.attachments:
        # Must be populated with (filename, filecontents) tuples.
        attachments = []
        for attachment in dj_message.attachments:
            if isinstance(attachment, MIMEBase):
                attachments.append((attachment.get_filename(),
                                    attachment.get_payload(decode=True)))
            else:
                attachments.append((attachment[0], attachment[1]))
        ae_message.attachments = attachments

    # Look for HTML alternative content.
    if isinstance(dj_message, EmailMultiAlternatives):
        for content, mimetype in dj_message.alternatives:
            if mimetype == 'text/html':
                ae_message.html = content
                break

    return ae_message
