var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200)
  res.json({
        "users": [
            { "username": "kfrn",
              "user_id": 1 },
            { "username": "symeshjb",
              "user_id": 4 } ]
  })
})

router.post('/signup', (req, res, next) => {
  res.status(201)
  res.json({ "data": true })
})

module.exports = router;
