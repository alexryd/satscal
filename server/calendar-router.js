import express from 'express'

import CalendarUtil from './calendar-util'
import CryptoUtil from './crypto-util'
import SatsApi from './sats-api'

const calendarRouter = express.Router()

calendarRouter.get('/:token', (req, res) => {
  const token = req.params.token
  const {userId, password} = CryptoUtil.decrypt(token)
  const api = new SatsApi()

  api.authenticate(userId, password)
    .then(() => {
      api.getActivities()
        .then((result) => {
          CalendarUtil.activitiesToIcal(result.activities).serve(res)
        })
        .catch((error) => {
          console.error(`Server returned an unknown response with status code ${error.status}:`,
            error.response.body)
          res.sendStatus(500)
        })
    })
    .catch((error) => {
      if (error.status === 401) {
        res.sendStatus(401)
      } else {
        console.error(`Server returned an unknown response with status code ${error.status}:`,
          error.response.body)
        res.sendStatus(500)
      }
    })
})

export default calendarRouter
