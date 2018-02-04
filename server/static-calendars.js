import Calendar from './calendar'

export class AuthenticationFailedCalendar extends Calendar {
  constructor() {
    super()
    this.addMessage()
  }

  addMessage() {
    const description = 'Det verkar som att du har ändrat ditt SATS-lösenord. ' +
                        'Då måste du också förnya din prenumeration på den ' +
                        'här kalendern för att den ska kunna fortsätta ' +
                        'fungera. Gå till https://satscal.herokuapp.com/ ' +
                        'och skapa en ny länk.'

    const now = new Date()
    const event = {
      uid: 'authentication-failed-message',
      status: 'TENTATIVE',
      summary: 'Förnya din prenumeration',
      description,
      url: 'https://satscal.herokuapp.com/',
      stamp: now,
      start: now,
      end: now,
      allDay: true,
    }

    this.builder.events.push(event)
  }
}

export class LegacyRequestCalendar extends Calendar {
  constructor() {
    super()
    this.addMessage()
  }

  addMessage() {
    const description = 'Den här prenumerationen av dina SATS-bokningar ' +
                        'stöds inte längre. Gå till ' +
                        'https://satscal.herokuapp.com/ och skapa en ny länk.'

    const now = new Date()
    const event = {
      uid: 'legacy-request-message',
      status: 'TENTATIVE',
      summary: 'Förnya din prenumeration',
      description,
      url: 'https://satscal.herokuapp.com/',
      stamp: now,
      start: now,
      end: now,
      allDay: true,
    }

    this.builder.events.push(event)
  }
}
