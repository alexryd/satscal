import {Cell, Grid} from 'react-mdl'
import React from 'react'

import IndexScreen from '../index'
import LinkScreen from '../link'

import './styles'

const AppScreen = React.createClass({
  propTypes: {
    currentScreen: React.PropTypes.string
  },

  render() {
    const currentScreen = this.props.currentScreen
    let screen = null
    if (currentScreen === 'login') {
      screen = <IndexScreen/>
    } else if (currentScreen === 'link') {
      screen = <LinkScreen/>
    }

    return (
      <div id='app'>
        <Grid>
          <Cell col={6} phone={4}>
            {screen}
          </Cell>
        </Grid>
      </div>
    )
  }
})

export default AppScreen
