var express = require('express')
var router = express.Router()
var passport = require('../passport')
var entriesDb = require('../db/entriesDb')
var userDb = require('../db/userDb')

router.get('/', ensureAuthenticated, (req, res, next) => {
  entriesDb.getAllEntries()
    .then( (entries) => {
      res.status(200)
      res.json({"entries": entries})
    })
    .catch( (err) => res.send(err) )
})

router.get('/:user_id', ensureAuthenticated, (req, res, next) => {
  entriesDb.getEntriesByUser(Number(req.params.user_id))
    .then( (user_entries) => {
      res.status(200)
      res.json({"user_entries": user_entries})
    })
    .catch( (err) => res.send(err) )
})

router.post('/', ensureAuthenticated, (req, res, next) => {
  entriesDb.addNewEntry(req.body.user_id, req.body.image_url)
    .then( (new_entry) => {
      userDb.decrement(req.body.user_id)
        .then( () => {
          res.status(201)
          res.send({"entry_id": new_entry[0]})
        })
    })
    .catch( (err) => res.send(err) )
})

router.post('/fluke', ensureAuthenticated, (req, res, next) => {
  entriesDb.checkAlreadyFluked(req.body.entry_id, req.body.user_id)
    .then( (response) => {
      if (response.length === 0) {
        entriesDb.increment(req.body.entry_id, req.body.user_id)
          .then( () => {
            res.status(201)
            res.send({"success": true, "action": "fluke", "user_id": req.body.user_id, "entry_id": req.body.entry_id})
          })
          .catch( (err) => res.send(err) )
      } else {
        entriesDb.decrement(req.body.entry_id, req.body.user_id)
          .then( () => {
            res.status(200)
            .send({"success": true, "action": "defluke", "user_id": req.body.user_id, "entry_id": req.body.entry_id})
          })
          .catch( (err) => res.send(err) )
      }
    })
    .catch( (err) => res.send(err) )
})

ensureAuthenticated = (req, res, next) => {
  return next()
  if (req.user) {
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
