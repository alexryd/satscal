import {Base} from 'tide'

import LoginActions from './actions/login'
import State from './state'

class Tide extends Base {
  constructor() {
    super()
    this.setState(new State())
    this.addActions('login', LoginActions)
  }
}

export default Tide
