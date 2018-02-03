import express from 'express'

import gaMiddleware from './ga-middleware'
import { SatsImageClient } from './sats-api'

const imageRouter = express.Router()

imageRouter.use(gaMiddleware)

imageRouter.get('/:userId/:token', (req, res) => {
  const userId = req.params.userId
  const token = req.params.token

  console.info(`Image requested for user with ID ${userId}`)
  req.visitor.set('uid', userId)
  req.visitor.pageview({
    dp: req.originalUrl,
    dt: `Image for ${userId}`,
  })

  const client = new SatsImageClient(token)
  client.get(userId).pipe(res)
})

export default imageRouter
