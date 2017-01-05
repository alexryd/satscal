import {Button, Cell, Grid, Spinner, Textfield} from 'react-mdl'
import React from 'react'
import {wrap} from 'tide'

import './styles'

const LoginForm = React.createClass({
  propTypes: {
    loading: React.PropTypes.bool,
    password: React.PropTypes.string,
    username: React.PropTypes.string
  },

  onSubmit(e) {
    e.preventDefault()
    this.props.tide.actions.login.submit()
  },

  onChangeUsername(e) {
    this.props.tide.actions.login.setUsername(e.target.value)
  },

  onChangePassword(e) {
    this.props.tide.actions.login.setPassword(e.target.value)
  },

  render() {
    return (
      <form id='login-form' onSubmit={this.onSubmit}>
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
              disabled={this.props.loading}
            />
          </Cell>
          <Cell col={6} tablet={4} phone={4}>
            <Textfield
              type='password'
              label='Lösenord'
              value={this.props.password}
              onChange={this.onChangePassword}
              disabled={this.props.loading}
            />
          </Cell>

          <Cell col={12} className='actions'>
            {this.props.loading ? <Spinner/> : null}
            <Button type='submit' raised colored disabled={this.props.loading}>
              Generera länk
            </Button>
          </Cell>
        </Grid>
      </form>
    )
  }
})

export default wrap(LoginForm, {
  'loading': 'login.loading',
  'password': 'login.password',
  'username': 'login.username'
})
