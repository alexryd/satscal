import {Button, Cell, Grid, Spinner, Textfield} from 'react-mdl'
import React from 'react'
import {wrap} from 'tide'

import './styles'

const LoginForm = React.createClass({
  propTypes: {
    password: React.PropTypes.string,
    username: React.PropTypes.string
  },

  onChangeUsername(e) {
    this.props.tide.actions.login.setUsername(e.target.value)
  },

  onChangePassword(e) {
    this.props.tide.actions.login.setPassword(e.target.value)
  },

  render() {
    return (
      <form id='login-form'>
        <Grid>
          <Cell col={12} className='details'>
            Fyll i samma användarnamn och lösenord som du loggar in med på
            {' '}<a href='https://www.sats.se' target='_blank'>SATS hemsida</a>{' '}
            eller i SATS mobilappar och klicka på Generera länk.
          </Cell>

          <Cell col={6} tablet={4} phone={4}>
            <Textfield
              label='Användarnamn'
              value={this.props.username}
              onChange={this.onChangeUsername}
            />
          </Cell>
          <Cell col={6} tablet={4} phone={4}>
            <Textfield
              type='password'
              label='Lösenord'
              value={this.props.password}
              onChange={this.onChangePassword}
            />
          </Cell>

          <Cell col={12} className='actions'>
            <Spinner/>
            <Button type='submit' raised colored>
              Generera länk
            </Button>
          </Cell>
        </Grid>
      </form>
    )
  }
})

export default wrap(LoginForm, {
  'login.password': true,
  'login.username': true
})
