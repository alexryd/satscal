import logging
from tornado.httpclient import AsyncHTTPClient
from tornado.options import define, options
from tornado.web import RequestHandler
import urllib


define('base_url', default='', help='prepend the given URL when constructing absolute URLs')
define('google_analytics_tracking_number', default='', help='track visits to this site using the given tracking number')
define('sats_api_base_url', default='http://api.sats.com/api', help='send SATS API requests to the given URL')
define('sats_api_default_locale', default='sv-SE', help='use the given locale with SATS API if none is specified')


class SATSCalRequestHandler(RequestHandler):
    def __init__(self, *args, **kwargs):
        super(SATSCalRequestHandler, self).__init__(*args, **kwargs)

        self.base_url = options.base_url.rstrip('/')

    def render_string(self, template_name, **kwargs):
        all_kwargs = dict(
            base_url=self.base_url,
            google_analytics_tracking_number=options.google_analytics_tracking_number,
        )
        all_kwargs.update(kwargs)

        return super(SATSCalRequestHandler, self).render_string(template_name, **all_kwargs)

    _ARG_DEFAULT = []
    def sats_request(self, uri, callback, token=_ARG_DEFAULT, locale=None, **kwargs):
        if token is self._ARG_DEFAULT:
            token = self.get_argument('t')
        if locale is None:
            locale = options.sats_api_default_locale

        url = '%s/%s/%s' % (
            options.sats_api_base_url.rstrip('/'),
            locale,
            uri.lstrip('/')
        )

        if token:
            url += ('&' if '?' in url else '?') + 'atkn=' + urllib.quote(token)

        all_kwargs = dict(
            user_agent='SATS/1.0 CFNetwork/548.0.4 Darwin/11.0.0',
        )
        all_kwargs.update(kwargs)

        logging.debug('Sending request to %s', url)

        client = AsyncHTTPClient()
        client.fetch(url, callback, **all_kwargs)
