import autoprefixer from 'autoprefixer'
import flexbugs from 'postcss-flexbugs-fixes'
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
    extensions: ['', '.css', '.scss', '.js', '.jsx'],
    alias: {
      app: path.resolve(__dirname, 'app')
    }
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?minimize&-autoprefixer',
          'postcss-loader',
          'sass'
        ]
      },
      {test: /\.js$|\.jsx$/, loader: 'babel', exclude: [nodeModulesPath]}
    ]
  },

  postcss: [
    flexbugs,
    autoprefixer({
      browsers: [
        'last 2 versions',
        'Android 4',
        'iOS 8',
        'ie 10',
        'ie_mob 10'
      ]
    })
  ],

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
