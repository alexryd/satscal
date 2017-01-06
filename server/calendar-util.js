import ical from 'ical-generator'

const CalendarUtil = {
  activitiesToIcal: (activities) => {
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

      let summary = 'Träning'
      if (activity.type === 'GROUP') {
        summary = activity.subType
      }

      cal.createEvent({
        uid: activity.id,
        start: date,
        stamp: date,
        end: new Date(date.getTime() + activity.durationInMinutes * 60 * 1000),
        status: (activity.status === 'COMPLETED' ? 'CONFIRMED' : 'TENTATIVE'),
        summary,
        description: ''
      })
    }

    return cal
  }
}

export default CalendarUtil
