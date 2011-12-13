from tornado.options import define, options
from tornado.web import RequestHandler


define('base_url', default='', help='prepend the given URL when constructing absolute URLs')


class SATSCalRequestHandler(RequestHandler):
    def __init__(self, *args, **kwargs):
        super(SATSCalRequestHandler, self).__init__(*args, **kwargs)

        self.base_url = options.base_url.rstrip('/')

    def render_string(self, template_name, **kwargs):
        all_kwargs = dict(
            base_url=self.base_url,
        )
        all_kwargs.update(kwargs)

        return super(SATSCalRequestHandler, self).render_string(template_name, **all_kwargs)
