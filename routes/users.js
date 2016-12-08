var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var passport = require('../passport')
var userDb = require('../db/userDb')
// const {getUsers, getUserByUsername, getUserById, createUser} = userDb

ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("yes");
    return next()
  } else {
    res.status(401)
    console.log("fail");
    res.send({"data": "Invalid Permissions"})
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("hit me");
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

router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  console.log("login route");
  res.status(200)
  res.send({"user": req.user})

})

// router.post('/login', (req, res) => {
//   userDb.getUserByUsername(req.body.username)
//     .then((user) => {
//       if (user.length === 0) {
//         res.status(401)
//       } else {
//         bcrypt.compare(req.body.password, user[0].password, function(err, response) {
//           if (err) console.log(err)
//           else if (response) {
//             res.status(200)
//             res.json(refactorUser(user))
//           }
//         })
//       }
//     })
//     .catch( (err) => res.send(err) )
// })

// refactorUser = (user) => {
//   return {"user": {
//     "username": user[0].username,
//     "user_id": user[0].id,
//     "shotsRemaining": user[0].shotsRemaining }
//   }
// }


module.exports = router
