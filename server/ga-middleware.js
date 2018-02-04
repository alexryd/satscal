import ua from 'universal-analytics'

const trackException = function(message, error) {
  if (error.response) {
    console.error(`${message} (${error.status}):`, error.response.body)
    this.visitor.exception(`${message} (${error.status})`)
  } else if (error.timeout) {
    console.error(`${message} (timeout)`)
    this.visitor.exception(`${message} (timeout)`)
  } else {
    console.error(`${message}:`, error)
    this.visitor.exception(message)
  }
}

const gaMiddleware = (req, res, next) => {
  const v = req.visitor = ua(process.env.GOOGLE_ANALYTICS_TRACKING_NUMBER)
  v.set('uip', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  v.set('ua', req.headers['user-agent'])
  v.set('ul', req.headers['accept-language'])

  const endMethod = res.end
  res.end = (...args) => {
    // override the end() method to send the GA request when the router
    // has finished handling the request
    v.send()
    res.end = endMethod
    res.end.apply(res, args)
  }

  req.trackException = trackException

  next()
}

export default gaMiddleware
