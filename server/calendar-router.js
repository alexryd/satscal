import express from 'express'

import CalendarUtil from './calendar-util'
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
          console.log(`${result.activities.length} activities found for user with ID ${userId}`)
          CalendarUtil.activitiesToIcal(result.activities).serve(res)
        })
        .catch((error) => {
          console.error(`Loading activities failed with status code ${error.status}:`,
            error.response.body)
          res.sendStatus(500)
        })
    })
    .catch((error) => {
      if (error.status === 401) {
        console.warn(`Authentication failed for used with ID ${userId}`)
        res.sendStatus(401)
      } else {
        console.error(`Authentication failed with status code ${error.status}:`,
          error.response.body)
        res.sendStatus(500)
      }
    })
})

export default calendarRouter
