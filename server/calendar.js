import icalToolkit from 'ical-toolkit'

import SatsCenters from './sats-centers'

const getDescription = activity => {
  const description = []

  if (activity.instructor) {
    description.push(`Instruktör: ${activity.instructor}`)
  }

  if (activity.roomName) {
    description.push(`Sal: ${activity.roomName}`)
  }

  if (activity.capacity && activity.bookedCount) {
    description.push(`${activity.bookedCount}/${activity.capacity} platser bokade`)
  }

  if (activity.waitingListIndex && activity.waitingListTotal) {
    description.push(`Du är nummer ${activity.waitingListIndex}/${activity.waitingListTotal} på väntelistan`)
  } else if (activity.waitingListIndex) {
    description.push(`Du är nummer ${activity.waitingListIndex} på väntelistan`)
  }

  if (activity.distance) {
    description.push(`Distans: ${activity.distance} km`)
  }

  if (activity.comment) {
    if (description.length > 0) {
      description.push('')
    }
    description.push(activity.comment)
  }

  return description.join('\n')
}

const isValidDate = value => {
  return value && parseInt(value.substr(0, 4)) > 1
}

const addDates = (activity, event) => {
  const date = new Date(activity.date)
  event.stamp = date

  if (isValidDate(activity.startTime)) {
    event.start = new Date(activity.startTime)
  } else {
    event.start = date
  }

  if (isValidDate(activity.endTime)) {
    event.end = new Date(activity.endTime)
  } else if (activity.duration) {
    event.end = new Date(date.getTime() + 1000 * 60 * activity.duration)
  } else {
    event.end = date
  }
}

const addLocation = (activity, event) => {
  const center = SatsCenters.get(activity.centerId)
  if (center) {
    let name = center.name
    if (center.postalAddress) {
      const a = center.postalAddress
      name += `\n${a.address}, ${a.postalCode} ${a.postalArea}, ${a.country}`
    }

    event.location = name

    if (center.latitude && center.longitude) {
      const title = name.replace(/\n/g, '\\n')
      const locationKey = `X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-TITLE="${title}"`
      event.additionalTags = {GEO: `${center.latitude};${center.longitude}`}
      event.additionalTags[locationKey] = `geo:${center.latitude},${center.longitude}`
    }
  } else if (activity.centerName) {
    event.location = activity.centerName
  }
}

class Calendar {
  constructor() {
    const builder = icalToolkit.createIcsFileBuilder()
    builder.calname = 'SATS'
    builder.prodid = '-//Alexander Rydén//satscal//SV'
    builder.spacers = false
    builder.throwError = true
    this.builder = builder
  }

  addActivities(activities) {
    for (const activity of activities) {
      const date = new Date(activity.date)

      const event = {
        uid: activity.id,
        status: 'CONFIRMED',
        summary: activity.activityName,
        description: getDescription(activity),
      }

      addDates(activity, event)
      addLocation(activity, event)

      this.builder.events.push(event)
    }
  }

  addBookings(bookings) {
    for (const booking of bookings) {
      const event = {
        uid: booking.bookingId,
        status: booking.state === 'OVERBOOKED_WAITINGLIST' ? 'TENTATIVE' : 'CONFIRMED',
        summary: booking.activityName,
        description: getDescription(booking),
      }

      addDates(booking, event)
      addLocation(booking, event)

      this.builder.events.push(event)
    }
  }

  get length() {
    return this.builder.events.length
  }

  toString() {
    return this.builder.toString()
  }

  send(res) {
    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"'
    })
    res.end(this.toString())
  }
}

export default Calendar
