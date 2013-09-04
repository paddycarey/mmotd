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
