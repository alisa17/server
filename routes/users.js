var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var Passport = require('passport')
var passport = require('../passport')
var userDb = require('../db/userDb')
var schedule = require('node-schedule')

/* GET users listing. */
router.get('/', ensureAuthenticated, (req, res, next) => {
  userDb.getUsers()
    .then((users) => {
      var obj = { "users": []}
      obj.users = users.map(({username, id}) => {
        res.status(200)
        return {username, "user_id": id}
      })
      res.json(obj)
    })
    .catch((err) => {
      res.send(err)
    })
})

router.post('/signup', (req, res, next) => {
  res.status(201)
  userDb.getUserByUsername(req.body.username)
    .then((user) => {
      if (user.length === 0) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            userDb.createUser(req.body.username, hash, req.body.email)
            .then((user) => {
              res.json({"user_id": user[0]})
            })
            .catch( (err) => res.send(err) )
          })
        })
      } else {
        res.status(400)
        res.send({"user_id": 0})
      }
    })
    .catch( (err) => res.send(err) )
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({"user": req.user})
})

// Testing schedule
// const secondCount = schedule.scheduleJob({second: null}, () => {
//   console.log(new Date(), 'job1')
// })
// var rule = new schedule.RecurrenceRule()
// rule.minute = 49
// schedule.scheduleJob(rule, () => console.log("it's 18.49"))

var rule = new schedule.RecurrenceRule()
// rule.hour = 0
rule.minute = 50

schedule.scheduleJob(rule, () => {
  console.log("schedule running")
  router.post('/reset', (req, res, next) => {
    resetShots()
    .then( () => {
      console.log("Shots reset!");
    })
    .catch( (err) => res.send(err) )
  })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.json({
      "error":
      {
        "type": "auth",
        "code": 401,
        "message": "authentication failed"
      }
    })
  }
}

module.exports = router
