import {exec} from 'child_process'

if (process.env.NODE_ENV === 'production') {
  const webpack = exec(
    './node_modules/.bin/webpack -p --config webpack.production.config.babel.js',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
      }
    }
  )

  webpack.stdout.on('data', console.log)
  webpack.stderr.on('data', console.log)
}
