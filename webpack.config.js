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
    modules: [ nodeModulesPath ],
    extensions: ['.css', '.scss', '.js', '.jsx'],
    alias: {
      app: path.join(__dirname, 'app')
    }
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?minimize',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$|\.jsx$/,
        use: [ 'babel-loader' ],
        exclude: [ nodeModulesPath ],
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'GOOGLE_ANALYTICS_TRACKING_NUMBER': JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_NUMBER)
    })
  ]
}
