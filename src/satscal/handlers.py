import json
import logging
from tornado import gen
from tornado.web import HTTPError, asynchronous
import urllib
from urlparse import urlparse

from satscal.sats import parse_sats_bookings
from satscal.web import SATSCalRequestHandler


class StartHandler(SATSCalRequestHandler):
    def get(self):
        self.render('start.html')


class GenerateHandler(SATSCalRequestHandler):
    @asynchronous
    @gen.engine
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')

        uri = 'auth/login?password=%s&user=%s' % (urllib.quote(password), urllib.quote(username))
        response = yield gen.Task(self.sats_request, uri, token=None)

        if response.error:
            logging.warn('Failed to authenticate the user:', response.error)
            raise HTTPError(response.error.code)
        else:
            data = json.loads(response.body)
            if not data.get('Success', False):
                logging.debug('Authentication response: %s', data)
                self.set_status(401)
                self.render('auth_failed.html')
                return

            self.render('generate.html',
                calendar_url=self.get_calendar_url(data),
                user_id=data.get('ID', ''),
                user_name=data.get('Name', ''),
                user_email=data.get('EMail', ''),
                user_image_url=self.get_profile_image_url(response, data),
            )

    def get_calendar_url(self, data):
        url_parts = urlparse(self.base_url)
        return 'webcal://%s%s/bookings/current?t=%s' % (
            url_parts.netloc,
            url_parts.path,
            urllib.quote(data.get('Token', ''))
        )

    def get_profile_image_url(self, response, data):
        if 'ProfileImg' in data:
            if urlparse(data['ProfileImg']).scheme:
                # if the URL is absolute, simply return it
                return data['ProfileImg']
            else:
                # else, prepend the scheme and hostname from the requested URL
                url_parts = urlparse(response.request.url)
                return '%s://%s%s?atkn=%s' % (
                    url_parts.scheme,
                    url_parts.netloc,
                    data['ProfileImg'],
                    urllib.quote(data.get('Token', ''))
                )
        else:
            return ''


class CurrentBookingsHandler(SATSCalRequestHandler):
    @asynchronous
    @gen.engine
    def get(self):
        response = yield gen.Task(self.sats_request, 'booking/listcurrent')

        if response.error:
            logging.warn('Failed to load a list of current bookings:', response.error)
            raise HTTPError(response.error.code)
        else:
            calendar = parse_sats_bookings(response.body)

            self.set_header('Content-Type', 'text/calendar')
            self.finish(calendar.as_string())


handlers = [
    (r'/', StartHandler),
    (r'/generate', GenerateHandler),
    (r'/bookings/current', CurrentBookingsHandler),
]
