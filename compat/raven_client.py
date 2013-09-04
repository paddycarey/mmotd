# third-party imports
from django.core.exceptions import SuspiciousOperation
from raven.contrib.django.client import DjangoClient
from raven.contrib.django.utils import get_host
from raven.utils.wsgi import get_environ
from raven.utils.wsgi import get_headers


class AppengineClient(DjangoClient):

    def get_user_info(self, user):
        if user is None:
            return {}

        user_info = {
            'id': user.user_id(),
            'email': user.email(),
            'username': user.email(),
        }

        return user_info

    def get_data_from_request(self, request):

        result = {}

        if hasattr(request, 'user'):
            result['sentry.interfaces.User'] = self.get_user_info(request.user)

        try:
            uri = request.build_absolute_uri()
        except SuspiciousOperation:
            # attempt to build a URL for reporting as Django won't allow us to
            # use get_host()
            if request.is_secure():
                scheme = 'https'
            else:
                scheme = 'http'
            host = get_host(request)
            uri = '%s://%s%s' % (scheme, host, request.path)

        if request.method != 'GET':
            try:
                data = request.body
            except:
                try:
                    data = request.raw_post_data and request.raw_post_data or request.POST
                except Exception:
                    # assume we had a partial read:
                    data = '<unavailable>'
        else:
            data = None

        environ = request.META

        result.update({
            'sentry.interfaces.Http': {
                'method': request.method,
                'url': uri,
                'query_string': request.META.get('QUERY_STRING'),
                'data': data,
                'cookies': dict(request.COOKIES),
                'headers': dict(get_headers(environ)),
                'env': dict(get_environ(environ)),
            }
        })

        return result
