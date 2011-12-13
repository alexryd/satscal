import os.path
from tornado.options import define, options
import tornado.web


define('debug_mode', default=0, help='set to 1 to enable Tornado\'s debug mode', type=int)


__version__ = '0.1.0'


class SATSCalApplication(tornado.web.Application):
    def __init__(self):
        handlers = []

        settings = dict(
            static_path = os.path.join(os.path.dirname(__file__), '../', 'static'),
            template_path = os.path.join(os.path.dirname(__file__), '../', 'templates'),
            debug=bool(options.debug_mode),
        )

        super(SATSCalApplication, self).__init__(handlers, **settings)
