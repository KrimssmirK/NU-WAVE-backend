var moment = require('moment')
var now = new Date()
var utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
var ph = 8
var timeOffset = ph

var phDate = new Date(utcTime + (3600000 * timeOffset))

var wrapped = moment(phDate)
// console.log(wrapped.format('MMMM Do YYYY'));
// console.log(wrapped.format('hh:mm A'));

module.exports.convertGMTtoPhTime = (date) => {
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
    const ph = 8
    const timeOffset = ph
    
    const phDate = new Date(utcTime + (3600000 * timeOffset))
    
    const wrapped = moment(phDate)
    const date_requested = wrapped.format('MMMM Do YYYY')
    const time_requested = wrapped.format('hh:mm A')

    return {
      date: date_requested,
      time: time_requested
    }
}