import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

import config from './webpack.config'

const nodeModulesPath = path.resolve(__dirname, 'node_modules')

config.devtool = 'source-map'
config.entry = path.join(__dirname, 'app', 'main')
config.output.filename = '[name]-[hash].min.js'

config.plugins = [
  new HtmlWebpackPlugin({
    template: 'app/index.tpl.html',
    inject: 'body',
    filename: 'index.html'
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true
    }
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'GOOGLE_ANALYTICS_TRACKING_NUMBER': JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_NUMBER)
  })
]

export default config
