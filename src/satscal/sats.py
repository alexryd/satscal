# -*- coding: utf-8 -*-

from datetime import datetime, timedelta
from icalendar import Calendar, Event
import pytz
import re


TIMEZONE = pytz.timezone('Europe/Stockholm')


def parse_sats_bookings(data):
    if not isinstance(data, list):
        raise Exception('Could not parse bookings data: %s' % data)

    calendar = Calendar()
    calendar.add('x-wr-calname', 'SATS')
    for b in data:
        calendar.add_component(parse_sats_booking(b))

    return calendar

def parse_sats_booking(data):
    start_time = parse_sats_date_time(data['StartTime'])
    booked = data.get('State') == 'Booked'

    summary = data.get('Class') or 'Bokning'
    if not booked:
        summary += u' \u2020\u2020'

    description = ''
    if 'Instructor' in data and data['Instructor']:
        description += u'\n\nInstruktör: ' + data['Instructor']
    if 'WIndex' in data and data['WIndex']:
        description += u'\n\nDu har plats %d i kön' % data['WIndex']

    booking = Event()
    booking.add('uid', data['ID'])
    booking.add('dtstamp', start_time)
    booking.add('dtstart', start_time)
    booking.add('dtend', start_time + timedelta(minutes=data.get('Length', 0)))
    booking.add('status', 'CONFIRMED' if booked else 'TENTATIVE')
    booking.add('summary', summary)
    booking.add('location', ('SATS ' + data.get('Center', '')).strip())
    if description:
        booking.add('description', description.strip())

    return booking

def parse_sats_date_time(dt):
    p = re.compile(r'([0-9]{4})-([0-9]{2})-([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})')
    m = p.match(dt)
    if m is None:
        return None

    return TIMEZONE.localize(datetime(
        int(m.group(1)),
        int(m.group(2)),
        int(m.group(3)),
        int(m.group(4)),
        int(m.group(5)),
        int(m.group(6)),
    ))
