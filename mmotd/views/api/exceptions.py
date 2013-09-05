"""
Custom exceptions used mostly to assist in rendering
proper JSON error responses from our API.
"""


class HttpException(Exception):
    reason = None
    status = None


class Http400(HttpException):
    reason = 'Bad Request'
    status = 400


class Http401(HttpException):
    reason = 'Unauthorized'
    status = 401


class Http403(HttpException):
    reason = 'Forbidden'
    status = 403


class Http404(HttpException):
    reason = 'Not Found'
    status = 404


class Http405(HttpException):
    reason = 'Method Not Allowed'
    status = 405
