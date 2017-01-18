import ical from 'ical-generator'

const TITLES = {
  SATS: {
    GROUP: 'subType',
    GYM: 'Träningspass i gymmet'
  },
  OTHER: {
    GROUP: {
      GROUP: 'Gruppträning'
    },
    OTHER: {
      badminton: 'Badminton',
      basketball: 'Basket',
      Circuittraining: 'Cirkelträning',
      climbing: 'Klättring',
      crosscountryskiing: 'Längdskidor',
      crosstrainer: 'Crosstrainer',
      cycle: 'Cykling',
      dance: 'Dans',
      downhill: 'Utförsåkning',
      floorball: 'Innebandy',
      football: 'Fotboll',
      golf: 'Golf',
      inlines: 'Inlines',
      kayak: 'Kajak',
      martialarts: 'Kampsport',
      other: 'Övrig träning',
      riding: 'Ridsport',
      rowing: 'Rodd',
      running: 'Löpning',
      skates: 'Skridskor',
      squash: 'Squash',
      swimming: 'Simning',
      tennis: 'Tennis',
      volleyball: 'Volleyboll',
      walking: 'Promenad',
      yoga: 'Yoga'
    }
  }
}
const TITLE_HIERARCHY = ['source', 'type', 'subType']

const CalendarUtil = {
  activitiesToIcal(activities) {
    const cal = ical({
      name: 'SATS',
      domain: 'satscal',
      prodId: {
        company: 'Alexander Rydén',
        product: 'satscal',
        language: 'SV'
      },
      ttl: 60 * 60
    })

    for (const activity of activities) {
      const date = new Date(activity.date)

      cal.createEvent({
        uid: activity.id,
        start: date,
        stamp: date,
        end: new Date(date.getTime() + activity.durationInMinutes * 60 * 1000),
        status: (activity.status === 'COMPLETED' ? 'CONFIRMED' : 'TENTATIVE'),
        summary: CalendarUtil.getSummary(activity),
        description: CalendarUtil.getDescription(activity)
      })
    }

    return cal
  },

  getSummary(activity) {
    let summary = 'Träningspass'
    let titles = TITLES

    for (const attr of TITLE_HIERARCHY) {
      const val = titles[activity[attr]]

      if (val === 'subType') {
        summary = activity.subType
        break
      } else if (typeof val === 'string') {
        summary = val
        break
      } else if (typeof val === 'undefined') {
        console.warn(`Unknown ${attr} in activity with ID ${activity.id}:`, {
          source: activity.source,
          type: activity.type,
          subType: activity.subType
        })
        break
      }

      titles = val
    }

    if (activity.booking !== null && activity.booking.status === 'queued') {
      summary += ' \u2020\u2020'
    }
    return summary
  },

  getDescription(activity) {
    let description = []

    if (activity.booking !== null) {
      const booking = activity.booking

      if (booking.class && booking.class.instructorId) {
        description.push(`Instruktör: ${booking.class.instructorId}`)
      }

      if (booking.positionInQueue > 0) {
        description.push(`Du har plats ${booking.positionInQueue} på väntelistan`)
      }
    }

    if (activity.distanceInKm > 0) {
      description.push(`Distans: ${activity.distanceInKm} km`)
    }

    if (activity.comment) {
      if (description.length > 0) {
        description.push('')
      }
      description.push(activity.comment)
    }

    return description.join('\n')
  }
}

export default CalendarUtil
