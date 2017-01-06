import {Actions} from 'tide'
import superagent from 'superagent'

class LoginActions extends Actions {
  setUsername(username) {
    this.mutate('login.username', username, {immediate: true})
  }

  setPassword(password) {
    this.mutate('login.password', password, {immediate: true})
  }

  submit() {
    const username = this.get('login.username')
    const password = this.get('login.password')

    if (this.get('login.loading') || !username || !password) {
      return
    }

    this.mutate('login.loading', true)

    superagent
      .post('/api/login')
      .send({username, password})
      .then((result) => {
        console.log('Success!', result)
        this.mutate('login.loading', false)
      })
      .catch((error) => {
        console.error('Something went wrong:', error.response.body)
        this.mutate('login.loading', false)
      })
  }
}

export default LoginActions
