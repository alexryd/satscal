import {Base} from 'tide'

import AppActions from './actions/app'
import LoginActions from './actions/login'
import State from './state'

class Tide extends Base {
  constructor() {
    super()
    this.setState(new State())
    this.addActions('app', AppActions)
    this.addActions('login', LoginActions)
  }
}

export default Tide
