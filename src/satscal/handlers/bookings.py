from tornado import gen
from tornado.httpclient import AsyncHTTPClient
from tornado.web import HTTPError, asynchronous

from satscal.web import SATSCalRequestHandler


class CurrentBookingsHandler(SATSCalRequestHandler):
    @asynchronous
    @gen.engine
    def get(self):
        token = self.get_argument('t')
        url = 'http://api.sats.com/api/sv-SE/booking/listcurrent?atkn=' + token

        client = AsyncHTTPClient()
        response = yield gen.Task(client.fetch, url)

        if response.error:
            print 'Error:', response.error
            raise HTTPError(500)
        else:
            self.finish(response.body)


handlers = [
    (r'/bookings/current', CurrentBookingsHandler),
]
