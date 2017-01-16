import superagent from 'superagent'

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
    const req = superagent[method](`https://www.sats.se/sats-api/se${uri}`)
    req.accept('json')
    req.set('User-Agent', 'SATSYou/5 (satscal.herokuapp.com)')

    if (data) {
      if (method === 'get') {
        req.query(data)
      } else {
        req.type('json')
        req.send(data)
      }
    }

    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }

    console.log(`${method.toUpperCase()} https://www.sats.se/sats-api/se${uri}`)
    return req
  }

  get(uri, data=null) {
    return this.request('get', uri, data)
  }

  post(uri, data=null) {
    return this.request('post', uri, data)
  }
}

export class SatsImageClient {
  constructor(token) {
    this.token = token
  }

  get(userId) {
    const req = superagent.get(`https://hfnapi.sats.com/api/Sats/members/${userId}/picture`)
    req.accept('*/*')
    req.set('User-Agent', 'SATSYou/5 (satscal.herokuapp.com)')
    req.set('Cookie', `Auth-SatsElixia=${this.token}`)
    console.log(`GET https://hfnapi.sats.com/api/Sats/members/${userId}/picture`)
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
      console.log(`Auth cache hit for username ${username}`)
      this.client.token = cachedAuth.token.value
      return Promise.resolve(cachedAuth)
    } else {
      console.log(`Auth cache miss for username ${username}`)
    }

    const data = {
      credentials: {
        login: username,
        password
      }
    }

    return this.client.post('/auth/token', data).then((res) => {
      const result = res.body

      this.client.token = result.token.value
      AuthCache.set(username, password, result)

      const userId = result.user.id
      if (userId && userId !== username) {
        AuthCache.set(userId, password, result)
      }

      return result
    })
  }

  getActivities(startDate=null, endDate=null) {
    const now = new Date()
    let start = startDate || new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    let end = endDate || new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8 * 7)

    start = start.toISOString().substring(0, 10).replace(/-/g, '')
    end = end.toISOString().substring(0, 10).replace(/-/g, '')

    return this.client.get(`/training/activities/${start},${end}`).then((res) => {
      return res.body
    })
  }

  getCenters() {
    return this.client.get('/centers').then((res) => {
      return res.body
    })
  }
}
