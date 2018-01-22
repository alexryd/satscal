import icalToolkit from 'ical-toolkit'

import SatsCenters from './sats-centers'

const getActivityDescription = activity => {
  const description = []

  if (activity.instructor) {
    description.push(`Instruktör: ${activity.instructor}`)
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
        start: new Date(activity.startTime),
        stamp: new Date(activity.date),
        end: new Date(activity.endTime),
        status: 'CONFIRMED',
        summary: activity.activityName,
        description: getActivityDescription(activity),
      }

      addLocation(activity, event)

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
