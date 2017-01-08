import {Actions} from 'tide'
import Immutable from 'immutable'

const LINK_STATE_KEY = 'linkState'
const LINK_STATE_TIMESTAMP_KEY = 'linkStateTimestamp'

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
      window.sessionStorage.setItem(
        LINK_STATE_TIMESTAMP_KEY,
        (new Date).getTime().toString()
      )
    } catch (e) {
    }
  }

  loadStoredLinkState() {
    let linkState = null
    let timestamp = 0

    try {
      linkState = JSON.parse(window.sessionStorage.getItem(LINK_STATE_KEY))
      timestamp = parseInt(window.sessionStorage.getItem(LINK_STATE_TIMESTAMP_KEY), 10)
    } catch (e) {
    }

    if (linkState && linkState.token && ((new Date).getTime() - timestamp) < 24 * 60 * 60 * 1000) {
      this.updateState((state) => {
        return state
          .set('link', Immutable.fromJS(linkState))
          .set('currentScreen', 'link')
      })
    }
  }
}

export default AppActions
