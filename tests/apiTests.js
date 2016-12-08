const test = require('tape')
const request = require('supertest')
const app = require('../app')



test('Can get users from /api/v1/users', t => {

  var expected = {
        "users": [
            { "username": "kfrn",
              "user_id": 1 },
            { "username": "symeshjb",
              "user_id": 2 } ]
      }

  request(app)
    .get('/api/v1/users')
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(Object.keys(res.body).length != 0, 'There is a response')
      t.equal(res.status, 200, 'HTTP 200 OK')
      t.true(res.body.hasOwnProperty('users'), 'There is a users key in the object returned from /users')
      t.true(res.body.users[0].hasOwnProperty('username'), 'The first obj in the "users" array has the key "username"')
      t.deepEqual(res.body.users[0], expected.users[0], 'Res.body should match expected structure')
      t.end()
    })
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
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(Object.keys(res.body).length != 0, 'There is a response')
      t.equal(res.status, 201, 'HTTP 201 Created')
      t.equal(typeof res.body.user_id, 'number', 'Returns user id and it is a number')
      t.notEqual(res.status, 400, 'Not a 400 error')
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
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(Object.keys(res.body).length != 0, 'There is a response')
      t.equal(res.status, 200, 'HTTP 200 OK')
      t.notEqual(res.status, 400, 'Not a 400 Bad Request error')
      t.notEqual(res.status, 401, 'Not a 401 Unauthorized error')
      t.true(res.body.hasOwnProperty("user"), 'Response has the key user')
      t.deepEqual(Object.keys(res.body.user), keys, "Response has the correct keys for the user object")
      t.end()
    })

})
