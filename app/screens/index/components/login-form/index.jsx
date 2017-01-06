import {Button, Cell, Grid, Spinner, Textfield} from 'react-mdl'
import React from 'react'
import {wrap} from 'tide'

import './styles'

const LoginForm = React.createClass({
  propTypes: {
    error: React.PropTypes.string,
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

  renderError() {
    const error = this.props.error
    let errorMessage
    if (error === 'invalid_username_or_password') {
      errorMessage = 'Användarnamnet eller lösenordet du skrev in verkar vara felaktigt. Var god försök igen.'
    } else if (error === 'unknown_error') {
      errorMessage = 'Ett okänt fel uppstod. Var god försök igen.'
    } else {
      return null
    }

    return (
      <Cell col={12}>
        <div className='error'>
          {errorMessage}
        </div>
      </Cell>
    )
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
              error={this.props.error === 'missing_username' ? 'Ange ett användarnamn' : null}
            />
          </Cell>
          <Cell col={6} tablet={4} phone={4}>
            <Textfield
              type='password'
              label='Lösenord'
              value={this.props.password}
              onChange={this.onChangePassword}
              disabled={this.props.loading}
              error={this.props.error === 'missing_password' ? 'Ange ett lösenord' : null}
            />
          </Cell>

          <Cell col={12} className='actions'>
            {this.props.loading ? <Spinner/> : null}
            <Button type='submit' raised colored disabled={this.props.loading}>
              Generera länk
            </Button>
          </Cell>

          {this.renderError()}
        </Grid>
      </form>
    )
  }
})

export default wrap(LoginForm, {
  'error': 'login.error',
  'loading': 'login.loading',
  'password': 'login.password',
  'username': 'login.username'
})
