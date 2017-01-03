import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackMiddleware from 'webpack-dev-middleware'

import config from './webpack.config'

const isDevelopment = process.env.NODE_ENV !== 'production'
const port = isDevelopment ? 3000 : process.env.PORT

const app = express()

if (isDevelopment) {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))

  app.get('*', (req, res) => {
    res.write(middleware.filesystem.readFileSync(path.join(__dirname, 'dist', 'index.html')))
    res.end()
  })
} else {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.info(`Server running on port ${port}`)
})
