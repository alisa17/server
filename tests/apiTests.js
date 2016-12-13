const test = require('tape')
const request = require('supertest')
const agent = require('superagent')
const app = require('../app')

// May be able to use this to pass tests with auth
const cookie = { path: '/',
  _expires: null,
  originalMaxAge: null,
  httpOnly: true }


test('Can get users from /api/v1/users', t => {

  var expected = {
        "users": [
            { "username": "kfrn",
              "user_id": 1 },
            { "username": "symeshjb",
              "user_id": 2 } ]
      }

  request(app)
    .post('/api/v1/users/login')
    .send({ username: 'kfrn', password: 'admin' })
    .end(function(err, res) {
      request(app)
        .get('/api/v1/users')
        .expect(200)
        .end( (err, res) => {
          t.false(err, 'There is no error')
          t.true(Object.keys(res.body).length != 0, 'There is a response')
          t.end()
        })
  });


})

test('Can create new user', t => {
  var randomNo = Math.floor(Math.random() * 1000)
  var user = {
    "username": "mel" + randomNo,
    "password": "samson",
    "email": "mel@mel.com"
    }

  request(app)
    .post('/api/v1/users/signup')
    .send(user)
    .expect(201)
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(Object.keys(res.body).length != 0, 'There is a response')
      t.equal(typeof res.body.user_id, 'number', 'Returns user id and it is a number')
      t.end()
    })

})

test('Can login as valid user', t => {
  var keys = ["username", "user_id", "shotsRemaining"]
  var user = {
    "username": "kfrn",
    "password": "admin"
    }

  request(app)
    .post('/api/v1/users/login')
    .send(user)
    .expect(200)
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(Object.keys(res.body.user).length != 0, 'There is a response')
      t.true(res.body.hasOwnProperty("user"), 'Response has the key user')
      t.deepEqual(Object.keys(res.body.user), keys, "Response has the correct keys for the user object")
      t.end()
    })
})

test('Can get all entries from DB', t => {
  request(app)
    .get('/api/v1/entries')
    .expect(200)
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(typeof res.body == 'object', 'Returns an object')
      t.true(res.body.entries.length > 2, 'More than two entries in DB')
      t.true(res.body.entries[0].hasOwnProperty('entry_id'), 'Response has the key entry_id')
      t.end()
    })

test('Can get all entries by user', t => {
  request(app)
    .get('/api/v1/entries/2')
    .expect(200)
    .end( (err, res) => {
        t.false(err, 'There is no error')
        t.true(typeof res.body == 'object', 'Returns an object')
        t.true(res.body.user_entries.length >= 2, '(At least) two entries in DB from user_id of 2')
        t.true(res.body.user_entries[0].user_id === 2, 'The entries are from the correct user')
        t.end()
    })
})

test('Can add new entry', t => {
  var obj = {
    "user_id": 1,
    "image_url": 'https://s-media-cache-ak0.pinimg.com/236x/eb/56/63/eb5663581b6c4ef5a83f630fa8e0c21a.jpg'
  }
  request(app)
    .post('/api/v1/entries')
    .send(obj)
    .end( (err, res) => {
        t.false(err, 'There is no error')
        t.true(typeof res.body == 'object', 'Returns an object')
        t.true(res.body.entry_id >= 4, 'Entry ID is > 4 (not one of our seeds)')
        t.true(typeof res.body.entry_id, 'Entry ID is a number')
        t.end()
      })
  })
})
