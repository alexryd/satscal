import logging
from tornado import gen
from tornado.web import HTTPError, asynchronous

from satscal.sats import parse_sats_bookings
from satscal.web import SATSCalRequestHandler


class StartHandler(SATSCalRequestHandler):
    def get(self):
        self.render('start.html')


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
    (r'/bookings/current', CurrentBookingsHandler),
]
