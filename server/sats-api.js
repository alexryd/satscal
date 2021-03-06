import superagent from 'superagent'

const BASE_URL = 'https://hfnapi.sats.com/api'
const CACHE = new Map()

const AuthCache = {
  get(username, password) {
    const c = CACHE.get(`${username}:${password}`)
    if (c && new Date().getTime() - c.timestamp < 24 * 60 * 60 * 1000) {
      return c.data
    }
    return null
  },

  set(username, password, data) {
    CACHE.set(`${username}:${password}`, {
      data,
      timestamp: new Date().getTime()
    })
  }
}

export class SatsApiClient {
  constructor(token=null) {
    this.token = token
  }

  request(method, uri, data) {
    const req = superagent[method](BASE_URL + uri)
    req.timeout({
      response: 15000,
      deadline: 30000,
    })
    req.accept('application/json')
    req.set('User-Agent', 'GXBooking/73 (satscal.herokuapp.com)')
    req.set('X-Preferred-Language', 'sv')

    if (data) {
      if (method === 'get') {
        req.query(data)
      } else {
        req.type('json')
        req.send(data)
      }
    }

    if (this.token) {
      req.set('X-CookieAuthentication', `Auth-SatsElixia=${this.token}`)
    }

    console.log(`${method.toUpperCase()} ${BASE_URL}${uri}`)
    return req
  }

  get(uri, data=null) {
    return this.request('get', '/sats' + uri, data)
  }

  post(uri, data=null) {
    return this.request('post', '/sats' + uri, data)
  }

  getV2(uri, data=null) {
    return this.request('get', '/v2/sats' + uri, data)
  }

  postV2(uri, data=null) {
    return this.request('post', '/v2/sats' + uri, data)
  }
}

export class SatsImageClient {
  constructor(token) {
    this.token = token
  }

  get(userId) {
    const url = `${BASE_URL}/sats/members/${userId}/picture?cookie_token=${this.token}`
    const req = superagent.get(url)
    req.accept('*/*')
    req.set('User-Agent', 'GXBooking/73 (satscal.herokuapp.com)')
    console.log(`GET ${BASE_URL}/sats/members/${userId}/picture`)
    return req
  }
}

export default class SatsApi {
  constructor(token=null) {
    this.client = new SatsApiClient(token)
  }

  authenticate(username, password) {
    const cachedAuth = AuthCache.get(username, password)
    if (cachedAuth !== null) {
      console.log(`Auth cache hit for username "${username}"`)
      this.client.token = cachedAuth.token
      return Promise.resolve(cachedAuth)
    } else {
      console.log(`Auth cache miss for username "${username}"`)
    }

    const data = {
      userId: username,
      passWord: password,
    }

    return this.client.post('/auth/login', data).then((res) => {
      const result = res.body

      this.client.token = result.token
      AuthCache.set(username, password, result)

      const userId = result.userId
      if (userId && userId !== username) {
        AuthCache.set(userId, password, result)
      }

      return result
    })
  }

  getUser() {
    return this.client.get('/members/self').then((res) => {
      return res.body
    })
  }

  getActivities(interval='12m') {
    return this.client.get(`/activities?interval=${interval}`).then((res) => {
      return res.body
    })
  }

  getBookings() {
    return this.client.getV2(`/members/booking`).then(res => {
      return res.body
    })
  }

  getCenters() {
    return this.client.get(`/centers?includeOnlyActive=true`).then((res) => {
      return res.body
    })
  }
}
