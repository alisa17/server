var express = require('express')
var router = express.Router()
var passport = require('../passport')
var entriesDb = require('../db/entriesDb')

ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("yes");
    return next()
  } else {
    res.status(401)
    console.log("fail");
    res.send({"users": "Invalid Permissions"})
  }
}

router.get('/', (req, res, next) => {
  entriesDb.getAllEntries()
    .then( (entries) => {
      // console.log("Got this route entries.js")
      res.status(200)
      res.json({"entries": entries})
    })
    .catch( (err) => res.send(err) )
})

router.get('/:id', (req, res, next) => {
  entriesDb.getEntriesByUser(Number(req.params.id))
    .then( (user_entries) => {
      res.status(200)
      // console.log("Got this route entries.js")
      res.json({"user_entries": user_entries})
    })
    .catch( (err) => res.send(err) )
})

router.post('/', (req, res, next) => {
  entriesDb.addNewEntry(req.body.user_id, req.body.image_url)
    .then( (new_entry) => {
      res.status(201)
      // console.log("res.send is ...", {"entry_id": new_entry[0]});
      res.send({"entry_id": new_entry[0]})
    })
    .catch( (err) => res.send(err) )
})


module.exports = router
