import autoprefixer from 'autoprefixer'
import flexbugs from 'postcss-flexbugs-fixes'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

const nodeModulesPath = path.resolve(__dirname, 'node_modules')

export default {
  devtool: 'eval-source-map',

  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'app', 'main')
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },

  resolve: {
    fallback: nodeModulesPath,
    extensions: ['', '.css', '.scss', '.js', '.jsx'],
    alias: {
      app: path.join(__dirname, 'app')
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
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'GOOGLE_ANALYTICS_TRACKING_NUMBER': JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_NUMBER),
      'TOKEN_ENCRYPTION_KEY': JSON.stringify('development')
    })
  ]
}
