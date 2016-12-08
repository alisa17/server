var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
        "users": [
            { "username": "kfrn",
              "user_id": 1 },
            { "username": "symeshjb",
              "user_id": 4 } ]
  })
})

module.exports = router;
