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

  console.info(`Login requested for username "${username}"`)

  api.authenticate(username, password)
    .then((result) => {
      console.info(`Successfully authenticated user with ID ${result.user.id}`)

      const token = CryptoUtil.encrypt(result.user.id, password)
      if (!token) {
        console.error('No token was returned after encrypting the userId and password')
        return res.status(500).json({error: 'internal_server_error'})
      }

      res.json({
        user_name: result.user.name,
        token,
        image_url: `/img/${result.user.id}/${result.token.value}`
      })
    })
    .catch((error) => {
      if (error.status === 401) {
        console.log(`Wrong password supplied for username "${username}"`)
        res.status(401).json({error: 'invalid_username_or_password'})
      } else {
        console.error(`Authentication failed with status code ${error.status}:`,
          error.response.body)
        res.status(500).json({error: 'internal_server_error'})
      }
    })
})

export default apiRouter
