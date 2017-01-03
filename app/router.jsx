import {browserHistory, IndexRoute, Route, Router} from 'react-router'
import React from 'react'
import {Component as TideComponent} from 'tide'

import AppScreen from './screens/app'
import IndexScreen from './screens/index'
import Tide from './tide'

const AppRouter = React.createClass({
  componentWillMount() {
    this.tide = new Tide()

    if (process.env.NODE_ENV !== 'production') {
      this.tide.enableLogging({actions: true, state: true, components: true})
    }
  },

  render() {
    return (
      <TideComponent impure tide={this.tide}>
        <Router history={browserHistory}>
          <Route path='/' component={AppScreen}>
            <IndexRoute component={IndexScreen}/>
          </Route>
        </Router>
      </TideComponent>
    )
  }
})

export default AppRouter
