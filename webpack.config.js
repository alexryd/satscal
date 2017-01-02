import path from 'path'
import webpack from 'webpack'

const nodeModulesPath = path.resolve(__dirname, 'node_modules')

export default {
  devtool: 'eval',

  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3001',
    path.resolve(__dirname, 'app', 'main')
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },

  resolve: {
    fallback: nodeModulesPath,
    extensions: ['', '.css', '.scss', '.js', '.jsx', '.json'],
    alias: {
      app: path.resolve(__dirname, 'app')
    }
  },

  module: {
    loaders: [
      {test: /\.js$|\.jsx$/, loader: 'babel', exclude: [nodeModulesPath]}
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
