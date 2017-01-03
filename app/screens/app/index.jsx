import {Cell, Grid} from 'react-mdl'
import React from 'react'

import './styles'

const AppScreen = React.createClass({
  render() {
    return (
      <div id='app'>
        <Grid>
          <Cell col={6} phone={4}>
            {this.props.children}
          </Cell>
        </Grid>
      </div>
    )
  }
})

export default AppScreen
