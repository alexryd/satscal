from tornado import gen
from tornado.web import HTTPError, asynchronous

from satscal.web import SATSCalRequestHandler


class CurrentBookingsHandler(SATSCalRequestHandler):
    @asynchronous
    @gen.engine
    def get(self):
        response = yield gen.Task(self.sats_request, 'booking/listcurrent')

        if response.error:
            print 'Error:', response.error
            raise HTTPError(500)
        else:
            self.finish(response.body)


handlers = [
    (r'/bookings/current', CurrentBookingsHandler),
]
