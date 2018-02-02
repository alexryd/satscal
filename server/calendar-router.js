import express from 'express'
import ua from 'universal-analytics'

import Calendar from './calendar'
import CryptoUtil from './crypto-util'
import SatsApi from './sats-api'

const calendarRouter = express.Router()

const getActivities = api => {
  return api.getActivities()
    .then(result => {
      return result.results
    })
    .catch(error => {
      if (error.response) {
        console.error(`Loading activities failed with status code ${error.status}:`,
          error.response.body)
      } else {
        console.error('An error occurred while loading activities:', error)
      }
      return []
    })
}

const getBookings = api => {
  return api.getBookings()
    .catch(error => {
      if (error.response) {
        console.error(`Loading bookings failed with status code ${error.status}:`,
          error.response.body)
      } else {
        console.error('An error occurred while loading bookings:', error)
      }
      return []
    })
}

calendarRouter.use((req, res, next) => {
  const v = req.visitor = ua(process.env.GOOGLE_ANALYTICS_TRACKING_NUMBER)
  v.set('uip', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  v.set('ua', req.headers['user-agent'])
  v.set('ul', req.headers['accept-language'])

  const sendHandler = () => {
    res.removeListener('finish', sendHandler)
    res.removeListener('close', sendHandler)

    v.send()
  }

  res.on('finish', sendHandler)
  res.on('close', sendHandler)

  next()
})

calendarRouter.get('/:token', (req, res) => {
  const token = req.params.token
  const {userId, password} = CryptoUtil.decrypt(token)
  const api = new SatsApi()

  if (!userId || !password) {
    console.error('Empty userId or password returned after decrypting', {userId, password})
    return res.sendStatus(500)
  } else {
    console.info(`Calendar requested for user with ID ${userId}`)
  }

  api.authenticate(userId, password)
    .then(() => {
      const calendar = new Calendar()

      getActivities(api)
        .then(activities => {
          calendar.addActivities(activities)
          return getBookings(api)
        })
        .then(bookings => {
          calendar.addBookings(bookings)

          req.visitor.pageview(req.originalUrl)

          console.log(`${calendar.length} activities found for user with ID ${userId}`)
          res.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="calendar.ics"'
          })
          res.end(calendar.toString())
        })
    })
    .catch((error) => {
      if (error.status === 401) {
        console.warn(`Authentication failed for user with ID ${userId}`)
        res.sendStatus(401)
      } else if (error.response) {
        console.error(`Authentication failed with status code ${error.status}:`,
          error.response.body)
        res.sendStatus(500)
      } else {
        console.error('An error occurred during authentication:', error)
        res.sendStatus(500)
      }
    })
})

export default calendarRouter
