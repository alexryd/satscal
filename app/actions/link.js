import {Actions} from 'tide'

class LinkActions extends Actions {
  goBack() {
    this.getActions('app').clearStoredLinkState()
    this.mutate('currentScreen', 'login')
  }
}

export default LinkActions
