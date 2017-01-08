import {Actions} from 'tide'
import Immutable from 'immutable'

const LINK_STATE_KEY = 'linkState'

class AppActions extends Actions {
  storeLinkState() {
    const linkState = this.get('link')
    if (!linkState.get('token')) {
      return
    }

    try {
      window.sessionStorage.setItem(
        LINK_STATE_KEY,
        JSON.stringify(linkState.toJS())
      )
    } catch (e) {
    }
  }

  loadStoredLinkState() {
    let linkState = null

    try {
      linkState = JSON.parse(window.sessionStorage.getItem(LINK_STATE_KEY))
    } catch (e) {
    }

    if (linkState && linkState.token) {
      this.updateState((state) => {
        return state
          .set('link', Immutable.fromJS(linkState))
          .set('currentScreen', 'link')
      })
    }
  }
}

export default AppActions
