import express from 'express'

import { AuthenticationFailedCalendar } from './static-calendars'
import Calendar from './calendar'
import CryptoUtil from './crypto-util'
import gaMiddleware from './ga-middleware'
import SatsApi from './sats-api'

const calendarRouter = express.Router()

const getActivities = (req, api) => {
  return api.getActivities()
    .then(result => {
      return result.results
    })
    .catch(error => {
      req.trackException('Load activities error', error)
      return []
    })
}

const getBookings = (req, api) => {
  return api.getBookings()
    .catch(error => {
      req.trackException('Load bookings error', error)
      return []
    })
}

calendarRouter.use(gaMiddleware)

calendarRouter.get('/:token', (req, res) => {
  const token = req.params.token
  const {userId, password} = CryptoUtil.decrypt(token)
  const api = new SatsApi()

  if (!userId || !password) {
    console.error('Empty userId or password returned after decrypting', {userId, password})
    req.visitor.exception('Token decryption error')
    return res.sendStatus(500)
  }

  console.info(`Calendar requested for user with ID ${userId}`)
  req.visitor.set('uid', userId)
  req.visitor.set('dt', `Calendar for ${userId}`)
  req.visitor.pageview()

  api.authenticate(userId, password)
    .then(() => {
      const calendar = new Calendar()

      getActivities(req, api)
        .then(activities => {
          calendar.addActivities(activities)
          return getBookings(req, api)
        })
        .then(bookings => {
          calendar.addBookings(bookings)

          console.log(`${calendar.length} activities found for user with ID ${userId}`)
          req.visitor.event({
            ec: 'Calendar',
            ea: 'Loaded activities',
            ev: calendar.length,
          })

          calendar.send(res)
        })
    })
    .catch((error) => {
      if (error.status === 401) {
        console.warn(`Authentication failed for user with ID ${userId}`)
        req.visitor.exception('Authentication failed')
        new AuthenticationFailedCalendar().send(res)
      } else {
        req.trackException('Authentication error', error)
        res.sendStatus(500)
      }
    })
})

export default calendarRouter
