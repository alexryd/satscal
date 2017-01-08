import superagent from 'superagent'

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
    const data = {
      credentials: {
        login: username,
        password
      }
    }

    return this.client.post('/auth/token', data).then((res) => {
      this.client.token = res.body.token.value
      return res.body
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
