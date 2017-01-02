import fs from 'fs'
import path from 'path'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import webpackConfig from '../webpack.config'

const port = 3001

export default () => {
  let startTime = null

  const compiler = Webpack(webpackConfig)
  compiler.plugin('compile', () => {
    startTime = Date.now()
    console.log('Bundling...')
  })
  compiler.plugin('done', () => {
    console.log('Bundle complete in ' + (Date.now() - startTime) + 'ms')
  })

  const bundler = new WebpackDevServer(compiler, {
    publicPath: '/build/',
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {colors: true}
  })

  bundler.listen(port, 'localhost', () => {
    console.log(`Webpack server running on port ${port}`)
  })
}
