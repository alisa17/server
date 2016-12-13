const moment = require('moment-timezone')

module.exports = convertTimeZone

 function convertTimeZone(timeinUTC) {
   const localTZ = 'Pacific/Auckland'
   var inLocalTime = moment.tz(timeinUTC, localTZ).format()
   console.log({inLocalTime});
   return inLocalTime
 }

 var inUTC = '2016-12-13 21:46:45'
 convertTimeZone(inUTC)
