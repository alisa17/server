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
      console.log(user);
      if(user.length === 0) done(null, false)
      else {
        bcrypt.compare(password, user[0].password, (err, valid) => {
          console.log({valid});
          if (err) cb(err)
          if (valid) done(null, refactorUser(user[0]))
          else done(null, false)
        })
      }
    })
    .catch((err) => {
      console.log(err);
      if (err) done(err)
    })
}))

// passport.use(new Strategy({passReqToCallback : true}, (req, username, password, cb) => {
//   // console.log("passport. req is", req);
//   db.getUserByUsernameCb(username, (err, user) => {
//     if (err) return cb(err)
//     if (!user) return cb(null, false)
//     bcrypt.compare(password, user[0].password, function(err, response) {
//       if (err) return cb(null, false)
//       var refUser = refactorUser(user[0])
//       if (response) return cb(null, refUser)
//       return cb(null, false)
//     })
//   })
// }))

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
