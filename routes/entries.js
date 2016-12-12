var express = require('express')
var router = express.Router()
var passport = require('../passport')
var entriesDb = require('../db/entriesDb')
var userDb = require('../db/userDb')
var followsDb = require('../db/followsDb')

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

router.get('/:user_id', ensureAuthenticated, (req, res, next) => {
  entriesDb.getAllEntries()
    .then( (entries) => {
      entriesDb.myFlukes(req.params.user_id)
        .then( (flukes) => {
          var myFlukes = flukes.map((fluke) => fluke.fluked_entry_id)
          res.status(200)
          res.json({entries, myFlukes})
        })
        .catch( (err) => res.send(err) )
    })
    .catch( (err) => res.send(err) )
})

router.get('/user/:target_id', ensureAuthenticated, (req, res, next) => {
  entriesDb.getEntriesByUser(Number(req.params.target_id))
    .then( (user_entries) => {
      res.status(200)
      res.json({"user_entries": user_entries})
    })
    .catch( (err) => res.send(err) )
})

router.post('/new', ensureAuthenticated, (req, res, next) => {
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

router.post('/comments/new', ensureAuthenticated, (req, res) => {
  //code goes here
    //recieve req object
    //knex add the comment to the comments table
    entriesDb.newComment(req.body)
      .then((comment_id) => {
        if (comment_id[0]) {
          entriesDb.incrementCommentCount(req.body.entry_id)
            .then((result) => {
              res.send({comment_id: comment_id[0]})
            })
        }
      })
      //on success, then increment the entry by 1
        //res.json the comment id
})

router.get('/comments/:entry_id', ensureAuthenticated, (req, res) => {
  entriesDb.getComments(req.params.entry_id)
    .then((comments) => {
      var parsedComments = comments.map(({username, comment, comment_created_at}) => {
        return {username, comment, comment_created_at}
      })
      res.json({entry_comments: parsedComments})
    })
})

router.get('/follows/:user_id', ensureAuthenticated, (req,res) => {
  res.send("get follows of " + req.params.user_id)
  // followsDb.getFollowingEntries(req.params.user_id)
  //   .then((followed_entries) => {
  //     console.log(followed_entries);
  //   })
})

router.post('/follows/new', ensureAuthenticated, (req, res) => {
  res.send("new follow")
})

router.post('/follows/delete', ensureAuthenticated, (req, res) => {
  res.send('delete follow')
})

module.exports = router
