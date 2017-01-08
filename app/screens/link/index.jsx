import {Button, Card, CardActions, CardText, CardTitle} from 'react-mdl'
import React from 'react'
import {wrap} from 'tide'

import './styles'

const LinkScreen = React.createClass({
  propTypes: {
    imageUrl: React.PropTypes.string,
    name: React.PropTypes.string,
    tide: React.PropTypes.object,
    token: React.PropTypes.string
  },

  onFocusCalendarUrl(e) {
    e.target.select()
  },

  onMouseUpCalendarUrl(e) {
    e.preventDefault()
  },

  onClickBack() {
    this.props.tide.actions.link.goBack()
  },

  render() {
    const imageUrl = this.props.imageUrl ? `url(${this.props.imageUrl})` : null
    const loc = window.location
    const calendarUrl = `//${loc.host}/cal/${encodeURIComponent(this.props.token)}`

    return (
      <Card id='link-screen' shadow={1}>
        <CardTitle style={{backgroundImage: imageUrl}}>
          {this.props.name}
        </CardTitle>

        <CardText>
          <h3 className='calendar-url-heading'>
            Länk
          </h3>
          <input
            type='text'
            value={loc.protocol + calendarUrl}
            readOnly
            className='calendar-url'
            onFocus={this.onFocusCalendarUrl}
            onMouseUp={this.onMouseUpCalendarUrl}
          />

          <div className='calendar-link-wrapper'>
            <a href={'webcal:' + calendarUrl} className='calendar-link'>
              Lägg in i din kalender
            </a>
          </div>

          <p>
            När du klickar på knappen här ovanför bör ditt kalenderprogram öppnas och automatiskt
            fråga dig om du vill börja prenumerera på den här kalendern. Om det inte händer kan du
            kopiera länken och sedan klicka på det program du använder nedan för att läsa om hur du
            lägger in en ny prenumeration:
          </p>

          <ul>
            <li>
              <a
                href='https://support.apple.com/kb/ph11523?locale=sv_SE'
                target='_blank'
              >
                Apple iCal
              </a>
            </li>
            <li>
              <a
                href='https://support.google.com/calendar/answer/37100?hl=sv'
                target='_blank'
              >
                Google Calendar
              </a>
            </li>
            <li>
              <a
                href='https://support.office.com/sv-se/article/Importera-och-prenumerera-på-kalendrar-i-Outlook-com-eller-Outlook-på-webben-CFF1429C-5AF6-41EC-A5B4-74F2C278E98C'
                target='_blank'
              >
                Microsoft Outlook
              </a>
            </li>
          </ul>

          <p className='icloud-tip'>
            <strong>Tips!</strong> Om du vill prenumerera på dina bokningar både på din dator och i
            din iPhone/iPad bör du undvika att lägga in den i iCloud, eftersom iCloud är väldigt
            dålig på att uppdatera prenumererade kalendrar. Du får istället lägga in den både på din
            dator och i din iPhone/iPad separat.
          </p>
        </CardText>

        <CardActions border>
          <Button onClick={this.onClickBack}>
            &laquo; Tillbaka
          </Button>
        </CardActions>
      </Card>
    )
  }
})

export default wrap(LinkScreen, {
  'imageUrl': 'link.imageUrl',
  'name': 'link.name',
  'token': 'link.token'
})
