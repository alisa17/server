var express = require('express')
var router = express.Router()
var entriesDb = require('../db/entriesDb')
var userDb = require('../db/userDb')
var followsDb = require('../db/followsDb')

router.get('/:user_id', ensureAuthenticated, (req, res, next) => {
  entriesDb.getAllEntries()
    .then((entries) => {
      entriesDb.myFlukes(req.params.user_id)
        .then((flukes) => {
          var myFlukes = flukes.map((fluke) => fluke.fluked_entry_id)
          res.status(200)
          res.json({entries, myFlukes})
        })
        .catch((err) => res.send(err))
    })
    .catch((err) => res.send(err))
})

router.get('/user/:target_id', ensureAuthenticated, (req, res, next) => {
  entriesDb.getEntriesByUser(Number(req.params.target_id))
    .then((user_entries) => {
      res.status(200)
      res.json({'user_entries': user_entries})
    })
    .catch((err) => res.send(err))
})

router.post('/new', ensureAuthenticated, (req, res, next) => {
  entriesDb.addNewEntry(req.body.user_id, req.body.image_url)
    .then((new_entry) => {
      userDb.decrement(req.body.user_id)
        .then(() => {
          res.status(201)
          res.send({'entry_id': new_entry[0]})
        })
    })
    .catch((err) => res.send(err))
})

router.post('/fluke', ensureAuthenticated, (req, res, next) => {
  entriesDb.checkAlreadyFluked(req.body.entry_id, req.body.user_id)
    .then((response) => {
      if (response.length === 0) {
        entriesDb.increment(req.body.entry_id, req.body.user_id)
          .then(() => {
            res.status(201)
            res.send({'success': true, 'action': 'fluke', 'user_id': req.body.user_id, 'entry_id': req.body.entry_id})
          })
          .catch((err) => res.send(err))
      } else {
        entriesDb.decrement(req.body.entry_id, req.body.user_id)
          .then(() => {
            res.status(200)
            .send({'success': true, 'action': 'defluke', 'user_id': req.body.user_id, 'entry_id': req.body.entry_id})
          })
          .catch((err) => res.send(err))
      }
    })
    .catch((err) => res.send(err))
})

router.post('/comments/new', ensureAuthenticated, (req, res) => {
  entriesDb.newComment(req.body)
      .then((comment_id) => {
        if (comment_id[0]) {
          entriesDb.incrementCommentCount(req.body.entry_id)
            .then((result) => {
              res.send({comment_id: comment_id[0]})
            })
        }
      })
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

router.get('/follows/:user_id', ensureAuthenticated, (req, res) => {
  followsDb.followingUsers(req.params.user_id)
    .then((following) => {
      var following_list = following.map((follow) => {
        return follow.followed_user_id
      })
      followsDb.getFollowingEntries(following_list)
        .then((entries) => {
          var followed_entries = entries.map((
            { entry_id, user_id, entry_created_at, username, comment_count, image_url }) => {
            return { entry_id, user_id, entry_created_at, username, comment_count, image_url }
          })
          res.send({followed_entries, following_list})
        })
    })
})

router.post('/follows/new', ensureAuthenticated, (req, res) => {
  followsDb.getFollow(req.body.following_user_id, req.body.followed_user_id)
    .then((follow) => {
      if (follow.length === 0) {
        followsDb.newFollow(req.body.following_user_id, req.body.followed_user_id)
          .then(res.send('success'))
      } else if (follow.length === 1) {
        followsDb.unFollow(req.body.following_user_id, req.body.followed_user_id)
          .then(res.send('success'))
      }
    })
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.json({
      'error':
      {
        'type': 'auth',
        'code': 401,
        'message': 'authentication failed'
      }
    })
  }
}

module.exports = router
