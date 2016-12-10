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

passport.use(new Strategy((username, password, done) => {
  db.getUserByUsername(username)
    .then((user) => {
      if(user.length === 0) done(null, false)
      else {
        bcrypt.compare(password, user[0].password, (err, valid) => {
          if (err) done(err)
          else if (valid) done(null, refactorUser(user[0]))
          else done(null, false)
        })
      }
    })
    .catch((err) => {
      console.log(err);
      done(err)
    })
}))

passport.serializeUser((user, done) => {
  console.log("serializeUser");
  done(null, user.user_id)
})

passport.deserializeUser((id, done) => {
  console.log("deserializeUser");
  db.getUserById(id)
    .then((user)=> {
      // if(user.length == 0) done(null, false)
      done(null, refactorUser(user[0]))
    })
    .catch((err) => {
      console.log({err});
      done(err)
    })
})

module.exports = passport
