var express = require('express');
var router = express.Router();

var userDb = [
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
  var obj = { "users": []}
  obj.users = userDb.map((user) => {
    return {"username": user.username, "user_id": user.id}
  })
  res.json(obj)
})

router.post('/signup', (req, res, next) => {
  res.status(201)
  userDb.push({
    "username": req.body.username,
    "password": req.body.password,
    "shotsRemaining": 4,
    "email": req.body.email
  })
  res.json({"data": true})
})

router.post('/login', (req, res) => {
  res.status(200)
  var user = userDb.find((dude) => {
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
