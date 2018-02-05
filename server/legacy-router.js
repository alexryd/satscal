import express from 'express'

import gaMiddleware from './ga-middleware'
import { LegacyRequestCalendar } from './static-calendars'

const legacyRouter = express.Router()

legacyRouter.use(gaMiddleware)

legacyRouter.get('/current', (req, res) => {
  let userId = null
  if (req.query && req.query.t) {
    const m = req.query.t.match(/^[0-9]+p[0-9]+/)
    if (m) {
      userId = m[0]
      req.visitor.set('uid', userId)
    }
  }

  if (userId) {
    console.info(`Legacy calendar request for user with ID ${userId}`)
    req.visitor.set('dt', `Legacy calendar for ${userId}`)
  } else {
    console.info('Legacy calendar request received')
    req.visitor.set('dt', 'Legacy calendar')
  }

  req.visitor.pageview()

  new LegacyRequestCalendar().send(res)
})

export default legacyRouter
