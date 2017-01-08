import {Card, CardActions, CardText, CardTitle} from 'react-mdl'
import React from 'react'
import {wrap} from 'tide'

import './styles'

const LinkScreen = React.createClass({
  propTypes: {
    imageUrl: React.PropTypes.string,
    name: React.PropTypes.string,
    token: React.PropTypes.string
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

        <div className='calendar-url'>
          {loc.protocol + calendarUrl}
        </div>

        <a href={(loc.protocol === 'https:' ? 'webcals:' : 'webcal:') + calendarUrl}>
          Lägg in i din kalender
        </a>
      </Card>
    )
  }
})

export default wrap(LinkScreen, {
  'imageUrl': 'link.imageUrl',
  'name': 'link.name',
  'token': 'link.token'
})
