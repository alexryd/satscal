import express from 'express'

import gaMiddleware from './ga-middleware'
import { LegacyRequestCalendar } from './static-calendars'

const legacyRouter = express.Router()

legacyRouter.use(gaMiddleware)

legacyRouter.get('/current', (req, res) => {
  console.info('Legacy calendar request received')
  req.visitor.pageview({
    dp: req.originalUrl,
    dt: 'Legacy calendar',
  })

  new LegacyRequestCalendar().send(res)
})

export default legacyRouter
