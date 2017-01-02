import express from 'express'
import httpProxy from 'http-proxy'
import {match, RouterContext} from 'react-router'
import path from 'path'
import React from 'react'
import {renderToString} from 'react-dom/server'

import bundle from './server/bundle'
import {routes} from './app/router'

const isProduction = process.env.NODE_ENV === 'production'
const port = isProduction ? process.env.PORT : 3000

const proxy = httpProxy.createProxyServer()
proxy.on('error', (err) => {
  console.error(`Could not connect to the proxy: ${err}`)
})

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'server', 'views'))

if (!isProduction) {
  bundle()

  app.all('/build/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:3001'
    })
  })
} else {
  app.use('/build', express.static(path.resolve(__dirname, 'build')))
}

app.get('*', (req, res) => {
  match(
    {routes, location: req.url},
    (err, redirectLocation, renderProps) => {
      if (err) {
        return res.status(500).send('Internal Server Error')
      }
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      }

      let markup = null

      if (renderProps) {
        markup = renderToString(<RouterContext {...renderProps}/>)
      } else {
        res.status(404)
      }

      return res.render('index', {markup})
    }
  )
})

app.listen(port, (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(`Server running on port ${port}`)
})
