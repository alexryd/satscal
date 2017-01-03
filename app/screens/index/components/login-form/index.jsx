import {Button, Cell, Grid, Spinner, Textfield} from 'react-mdl'
import React from 'react'

import './styles'

const LoginForm = React.createClass({
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
            <Textfield label='Användarnamn'/>
          </Cell>
          <Cell col={6} tablet={4} phone={4}>
            <Textfield type='password' label='Lösenord'/>
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

export default LoginForm
