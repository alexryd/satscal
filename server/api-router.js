import bodyParser from 'body-parser'
import express from 'express'

import CryptoUtil from './crypto-util'
import SatsApi from './sats-api'

const apiRouter = express.Router()
const jsonParser = bodyParser.json()

apiRouter.post('/login', jsonParser, (req, res) => {
  if (!req.body) {
    return res.sendStatus(400)
  }

  const api = new SatsApi()
  const username = req.body.username
  const password = req.body.password

  if (!username) {
    return res.status(400).json({error: 'missing_username'})
  } else if (!password) {
    return res.status(400).json({error: 'missing_password'})
  }

  api.authenticate(username, password)
    .then((result) => {
      const token = CryptoUtil.encrypt(result.user.id, password)

      res.json({
        user_name: result.user.name,
        token
      })
    })
    .catch((error) => {
      if (error.status === 401) {
        res.status(401).json({error: 'invalid_username_or_password'})
      } else {
        console.error(`Server returned an unknown response with status code ${error.status}:`,
          error.response.body)
        res.status(500).json({error: 'internal_server_error'})
      }
    })
})

export default apiRouter
