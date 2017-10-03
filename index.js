var ical = require('ical-generator')
var axios = require('axios')
var timezone = require('system-timezone')
var moment = require('moment')
var fs = require('fs')

var username = process.env.USERNAME
var password = process.env.PASSWORD

axios.defaults.auth = {
  username: username,
  password: password
}

axios.get('https://www.paprikaapp.com/api/v1/sync/meals/')
  .then(function (response) {
    var events = []
    response.data.result.forEach(function (event) {
      events.push({
        start: moment(event.date).toDate(),
        summary: event.name,
        allDay: true
      })
    })
    events.sort(function (a, b) {
      return a.start - b.start
    })
    var cal = ical({
      domain: 'www.paprikaapp.com',
      prodId: {company: 'Richard Peng', product: 'ical-generator'},
      name: 'Paprika Menu',
      timezone: timezone(),
      events: events
    })
    fs.writeFile('paprika.ical', cal.toString(), function (e) {
      if (e) throw e
    })
  })
  .catch(function (e) {
    console.error(e.response.data.error.message)
  })
