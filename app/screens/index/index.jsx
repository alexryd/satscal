import {Card, CardActions, CardText, CardTitle} from 'react-mdl'
import React from 'react'

import LoginForm from './components/login-form'

import './styles'

const IndexScreen = React.createClass({
  render() {
    return (
      <Card id='index-screen' shadow={1}>
        <CardTitle>
          Prenumerera på dina SATS-bokningar
        </CardTitle>

        <CardText className='intro'>
          Här kan du generera en länk som du sen kan lägga in i ditt kalenderprogram (iCal, Outlook
          osv.) för att få in de pass du har bokat på SATS i din kalender automatiskt. Inget mer
          lägga in för hand eller komma ihåg att ta bort när du avbokar!
        </CardText>

        <LoginForm/>

        <CardText className='disclaimer'>
          Dina uppgifter kommer inte att sparas på något sätt. De används bara för att autentisera
          dig mot SATS servrar och att sen generera en länk som är unik för ditt konto.
        </CardText>
      </Card>
    )
  }
})

export default IndexScreen
