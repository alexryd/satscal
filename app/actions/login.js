import {Actions} from 'tide'

class LoginActions extends Actions {
  setUsername(username) {
    this.mutate('login.username', username, {immediate: true})
  }

  setPassword(password) {
    this.mutate('login.password', password, {immediate: true})
  }
}

export default LoginActions
