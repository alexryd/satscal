import {Actions} from 'tide'

class LoginActions extends Actions {
  setUsername(username) {
    this.mutate('login.username', username, {immediate: true})
  }

  setPassword(password) {
    this.mutate('login.password', password, {immediate: true})
  }

  submit() {
    if (this.get('login.loading')) {
      return
    }

    this.mutate('login.loading', true)
  }
}

export default LoginActions
