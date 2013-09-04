"""
Helpers to assist when using gravatar
"""
# stdlib imports
import hashlib
import urllib


def gravatar(email, size=35):
    """
    Returns a gravatar url of the specified size for the given email, falling
    back to the specified default when the user has not configured a gravatar.
    """
    gravatar_url = "http://www.gravatar.com/avatar/"
    gravatar_url += hashlib.md5(email.lower()).hexdigest() + "?"
    gravatar_url += urllib.urlencode({'s':str(size)})
    return gravatar_url
