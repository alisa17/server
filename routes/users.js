var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')

var userDb = require('../db/userDb')
// const {getUsers, getUserByUsername, getUserById, createUser} = userDb


var userDbMem = [
  { "username": "kfrn",
    "id": 1,
    "password": "admin",
    "shotsRemaining": 3,
    "email": "knfrances@gmail.com"
   },
  { "username": "symeshjb",
    "id": 2,
    "password": "memes",
    "shotsRemaining": 3,
    "email": "symeshjb@gmail.com"
  }
]
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200)

  userDb.getUsers()
    .then((users) => {
      var obj = { "users": []}
      obj.users = users.map(({username, id}) => {
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
            // console.log("hash, uname", hash, req.body.username);
            console.log(req.body);
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

router.post('/login', (req, res) => {
  res.status(200)
  var user = userDbMem.find((dude) => {
    return dude.username == req.body.username &&
      dude.password == req.body.password
  })
  if (user) {
    res.json({"user": {
      "username": user.username,
      "user_id": user.id,
      "shotsRemaining": user.shotsRemaining
    }})
  }

})
module.exports = router;
