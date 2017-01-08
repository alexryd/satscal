import './styles/index'
import 'react-mdl/extra/material.min.js'

import React from 'react'
import ReactDOM from 'react-dom'
import {Component as TideComponent} from 'tide'

import AppScreen from './screens/app'
import Tide from './tide'

if (GOOGLE_ANALYTICS_TRACKING_NUMBER) {
  require('./utils/google-analytics')
}

const tide = new Tide()

if (process.env.NODE_ENV !== 'production') {
  tide.enableLogging({actions: true, state: true, components: true})
}

const appScreen = (
  <TideComponent impure tide={tide} currentScreen='currentScreen'>
    <AppScreen/>
  </TideComponent>
)

ReactDOM.render(appScreen, document.getElementById('root'))
