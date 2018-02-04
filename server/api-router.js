import bodyParser from 'body-parser'
import express from 'express'

import CryptoUtil from './crypto-util'
import gaMiddleware from './ga-middleware'
import SatsApi from './sats-api'

const apiRouter = express.Router()
const jsonParser = bodyParser.json()

apiRouter.use(gaMiddleware)

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
  req.visitor.set('dt', `Authenticating ${username}`)
  req.visitor.pageview()

  api.authenticate(username, password)
    .then((result) => {
      const satsToken = result.token
      const userId = result.userId

      console.info(`Successfully authenticated user with ID ${userId}`)
      req.visitor.set('uid', userId)

      const token = CryptoUtil.encrypt(userId, password)
      if (!token) {
        console.error('No token was returned after encrypting the userId and password')
        req.visitor.exception('Token encryption error')
        return res.status(500).json({error: 'internal_server_error'})
      }

      api.getUser()
        .then(result => {
          console.log(`User "${result.fullName}" loaded`)
          req.visitor.event({
            ec: 'API',
            ea: 'Login',
          })

          res.json({
            user_name: result.fullName,
            token,
            image_url: `/img/${userId}/${satsToken}`
          })
        })
        .catch(error => {
          req.trackException('Load user error', error)
          res.status(500).json({error: 'internal_server_error'})
        })
    })
    .catch((error) => {
      if (error.status === 401) {
        console.log(`Wrong password supplied for username "${username}"`)
        req.visitor.exception('Authentication failed')
        res.status(401).json({error: 'invalid_username_or_password'})
      } else {
        req.trackException('Authentication error', error)
        res.status(500).json({error: 'internal_server_error'})
      }
    })
})

export default apiRouter
