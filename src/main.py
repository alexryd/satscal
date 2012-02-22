# -*- coding: utf-8 -*-

import grp
import os
import pwd
import tornado.httpserver
import tornado.ioloop
import tornado.options
from tornado.options import define, options

from satscal import SATSCalApplication


define('run_as_user', default=None, help='run as the given user (requires root privileges)')
define('run_as_group', default=None, help='run as the given group (requires root privileges)')
define('enable_xheaders', default=0, help='enable support for X-Real-Ip and X-Scheme headers', type=int)
define('port', default=8080, help='run on the given port', type=int)
define('child_processes', default=1, help='fork the given number of child processes', type=int)


def main():
    tornado.options.parse_command_line()

    if options.run_as_group:
        os.setgid(grp.getgrnam(options.run_as_group).gr_gid)
    if options.run_as_user:
        os.setuid(pwd.getpwnam(options.run_as_user).pw_uid)

    http_server = tornado.httpserver.HTTPServer(SATSCalApplication(), xheaders=bool(options.enable_xheaders))
    http_server.bind(options.port)

    try:
        http_server.start(options.child_processes)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
