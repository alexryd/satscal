import {browserHistory, IndexRoute, Route, Router} from 'react-router'
import React from 'react'

import AppScreen from './screens/app'
import IndexScreen from './screens/index'

export const routes = [
  <Route path='/' component={AppScreen}>
    <IndexRoute component={IndexScreen}/>
  </Route>
]

const AppRouter = React.createClass({
  render() {
    return (
      <Router history={browserHistory} routes={routes}/>
    )
  }
})

export default AppRouter
