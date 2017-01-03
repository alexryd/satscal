import {browserHistory, IndexRoute, Route, Router} from 'react-router'
import React from 'react'

import AppScreen from './screens/app'
import IndexScreen from './screens/index'

const AppRouter = React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={AppScreen}>
          <IndexRoute component={IndexScreen}/>
        </Route>
      </Router>
    )
  }
})

export default AppRouter
