var express = require('express')
var router = express.Router()
var passport = require('../passport')
var entriesDb = require('../db/entriesDb')
var userDb = require('../db/userDb')

ensureAuthenticated = (req, res, next) => {
  // console.log("authenticated", req);
  console.log("req.user",req.user);
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
  // var sessionId = Object.keys(req.sessionStore.sessions)
  // if (sessionId.length > 0) {
  //   console.log("yes");
  //   return next()
  // } else {
  //   res.status(401)
  //   // console.log("hitting 401");
  //   res.send({"users": "Invalid Permissions"})
  // }
}

router.get('/', ensureAuthenticated, (req, res, next) => {
  // console.log("getentreies", req);
  entriesDb.getAllEntries()
    .then( (entries) => {
      console.log("entries", entries);
      // console.log("Got this route entries.js")
      res.status(200)
      res.json({"entries": entries})
    })
    .catch( (err) => res.send(err) )
})

router.get('/:user_id', ensureAuthenticated, (req, res, next) => {
  entriesDb.getEntriesByUser(Number(req.params.user_id))
    .then( (user_entries) => {
      res.status(200)
      // console.log("Got this route entries.js")
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
      // console.log("res.send is ...", {"entry_id": new_entry[0]});
    })
    .catch( (err) => res.send(err) )
})

router.post('/fluke', ensureAuthenticated, (req, res, next) => {
  entriesDb.checkAlreadyFluked(req.body.user_id, req.body.entry_id)
    .then( (response) => {
      if (response.length === 0) {
        entriesDb.increment(req.body.user_id, req.body.entry_id)
          .then( () => {
            res.status(201)
            // res.status({success: true})
            .send('Entry fluked!')
          })
          .catch( (err) => res.send(err) )
      } else {
        entriesDb.decrement(req.body.user_id, req.body.entry_id)
          .then( () => {
            res.status(200)
            .send('Entry defluked!')
          })
          .catch( (err) => res.send(err) )
      }
    })
    .catch( (err) => res.send(err) )
})


module.exports = router
