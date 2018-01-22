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

  if (activity.waitingListIndex) {
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

const addDates = (activity, event) => {
  event.start = new Date(activity.startTime)
  event.stamp = new Date(activity.date)
  event.end = new Date(activity.endTime)
}

const addLocation = (activity, event) => {
  const center = SatsCenters.get(activity.centerId)
  if (center) {
    event.location = center.name

    if (center.latitude && center.longitude) {
      const locationKey = `X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-TITLE="${center.name}"`
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
}

export default Calendar
