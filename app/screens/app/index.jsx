import {Cell, Grid} from 'react-mdl'
import React from 'react'

import IndexScreen from '../index'

import './styles'

const AppScreen = React.createClass({
  propTypes: {
    currentScreen: React.PropTypes.string
  },

  render() {
    let screen = null
    if (this.props.currentScreen === 'login') {
      screen = <IndexScreen/>
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
