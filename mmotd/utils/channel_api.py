"""
Small utility library that abstracts out some common channel api functions
"""
# third-party imports
from django.core.urlresolvers import reverse
from google.appengine.api import channel
from google.appengine.api import taskqueue


def send_message(tokens, message):
    """
    Send a message via the channel API to to the given tokens in sequence

    Args:
        tokens: str() or list(): single token as string, or iterable containing
                list of tokens as strings (can also be channel_ids but tokens
                are more robust)
        message: str(): message that should be sent to the clients

    Returns:
        msg_count: int(): count of messages that were sent

    >>> from mmotd.utils import channel_api
    >>> message_count = channel_api.send_messages('XXXXXX', '{"hey":"there"}')
    """

    # make tokens a tuple if only a single string was passed
    if isinstance(tokens, basestring):
        tokens = (tokens,)

    # send messages out over the channel synchronously
    msg_count = 0
    for token in tokens:
        channel.send_message(token, message)
        msg_count += 1
    return msg_count


def send_message_async(tokens, message):
    """
    Send a message asynchronously via the taskqueue and channel API to the
    given tokens in parallel. We use an extremely high throughput taskqueue
    solely for the purpose of relaying channel messages, this ensures low
    latency while allowing us to fan out messages as quickly as possible at
    scale.

    Args:
        tokens: str() or list(): single token as string, or iterable containing
                list of tokens as strings (can also be channel_ids but tokens
                are more robust)
        message: str(): message that should be sent to the clients

    Returns:
        msg_count: int(): count of messages that were sent

    >>> from mmotd.utils import channel_api
    >>> message_count = channel_api.send_message_async('XXXXXX', '{"hey":"there"}')
    """

    # make tokens a tuple if only a single string was passed
    if isinstance(tokens, basestring):
        tokens = (tokens,)

    queue = taskqueue.Queue(name='channel-relay')
    task_url = reverse('mmotd-task-channel-relay')

    # send messages out over the channel asynchronously
    msg_count = 0
    for token in tokens:
        task = taskqueue.Task(url=task_url, params={'token': token, 'message': message})
        queue.add_async(task)
        msg_count += 1
    return msg_count
