import express from 'express'

import {SatsImageClient} from './sats-api'

const imageRouter = express.Router()

imageRouter.get('/:userId/:token', (req, res) => {
  console.info(`Image requested for user with ID ${req.params.userId}`)
  const client = new SatsImageClient(req.params.token)
  client.get(req.params.userId).pipe(res)
})

export default imageRouter
