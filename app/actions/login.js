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

    if (this.get('login.loading')) {
      return
    } else if (!username) {
      this.mutate('login.error', 'missing_username')
      return
    } else if (!password) {
      this.mutate('login.error', 'missing_password')
      return
    }

    this.mutate('login.loading', true)
    this.mutate('login.error', null)

    superagent
      .post('/api/login')
      .send({username, password})
      .then((response) => {
        const data = response.body
        this.updateState((state) => {
          return state
            .setIn(['login', 'loading'], false)
            .setIn(['link', 'name'], data.user_name)
            .setIn(['link', 'imageUrl'], data.image_url)
            .setIn(['link', 'token'], data.token)
            .set('currentScreen', 'link')
        })
      })
      .catch((error) => {
        const errorString = error.status === 401 ? 'invalid_username_or_password' : 'unknown_error'
        this.mutate('login.error', errorString)
        this.mutate('login.loading', false)
      })
  }
}

export default LoginActions
