import React from 'react'

const AppScreen = React.createClass({
  render() {
    return (
      <div id='app'>
        {this.props.children}
      </div>
    )
  }
})

export default AppScreen
