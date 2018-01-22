import express from 'express'

import Calendar from './calendar'
import CryptoUtil from './crypto-util'
import SatsApi from './sats-api'

const calendarRouter = express.Router()

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
      api.getActivities()
        .then((result) => {
          const calendar = new Calendar()
          calendar.addActivities(result.results)

          console.log(`${calendar.length} activities found for user with ID ${userId}`)
          res.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="calendar.ics"'
          })
          res.end(calendar.toString())
        })
        .catch((error) => {
          if (error.response) {
            console.error(`Loading activities failed with status code ${error.status}:`,
              error.response.body)
            res.sendStatus(500)
          } else {
            console.error('An error occurred while loading activities:', error)
            res.sendStatus(500)
          }
        })
    })
    .catch((error) => {
      if (error.status === 401) {
        console.warn(`Authentication failed for used with ID ${userId}`)
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
