const autoprefixer = require('autoprefixer')
const flexbugs = require('postcss-flexbugs-fixes')

module.exports = {
  plugins: [
    flexbugs,
    autoprefixer({
      browsers: [
        'last 2 versions',
        'Android 4',
        'iOS 8',
        'ie 10',
        'ie_mob 10'
      ],
    }),
  ],
}
