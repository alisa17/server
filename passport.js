var passport = require('passport')
var Strategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')

var db = require('./db/userDb')

refactorUser = (user) => {
  return {
    "username": user.username,
    "user_id": user.id,
    "shotsRemaining": user.shotsRemaining
  }
}

passport.use(new Strategy((username, password, cb) => {
  db.getUserByUsernameCb(username, (err, user) => {
    if (err) return cb(err)
    if (!user) return cb(null, false)
    bcrypt.compare(password, user[0].password, function(err, response) {
      if (err) return cb(null, false)
      var refUser = refactorUser(user[0])
      if (response) return cb(null, refUser)
      return cb(null, false)
    })
  })
}))

passport.serializeUser((user, cb) => {
  console.log("serializeUser");
  cb(null, user.user_id)
})

passport.deserializeUser((id, cb) => {
  console.log("deserializeUser");
  db.getUserById(id, (err, user) => {
    if (err) return cb(err)
    cb(null, refactorUser(user[0]))
  })
})



module.exports = passport
