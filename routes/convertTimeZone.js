const moment = require('moment')
const momentTZ = require('moment-timezone')

module.exports = convertTimeZone

 function convertTimeZone(timeinUTC) {

   var setUTC = moment.utc(timeinUTC).format()
   var localTime = moment(setUTC).local().format()
   var formatted = moment(localTime).format('HH:mma, Do MMM')

   console.log("UTC date is: ", setUTC)
   console.log("localDate is: ", localTime)
   console.log("now formatted: ", formatted)

   return formatted
 }

// Testing
var inUTC = '2016-12-13 21:46:45'
convertTimeZone(inUTC)
