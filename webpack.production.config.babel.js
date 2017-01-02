import path from 'path'
import webpack from 'webpack'

import config from './webpack.config'

const nodeModulesPath = path.resolve(__dirname, 'node_modules')

config.devtool = 'source-map'
config.entry = path.resolve(__dirname, 'app', 'main')

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false}
  })
]

export default config
