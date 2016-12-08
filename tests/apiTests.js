const test = require('tape')
const request = require('supertest')
const app = require('../app')



test('Can get users from /api/v1/users', t => {

  var expected = {
        "users": [
            { "username": "kfrn",
              "user_id": 1 },
            { "username": "symeshjb",
              "user_id": 4 } ]
      }

  request(app)
    .get('/api/v1/users')
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(res, 'There is a response')
      t.equal(res.status, 200, 'HTTP 200 OK')
      t.true(res.body.hasOwnProperty('users'), 'There is a users key in the object returned from /users')
      t.true(res.body.users[0].hasOwnProperty('username'), 'The first obj in the "users" array has the key "username"')
      t.deepEqual(res.body, expected, 'Res.body should match expected structure')
      t.end()
    })
})

test('Can create new user', t => {

  var user = {
    "username": "kfrn",
    "password": "admin",
    "email": "knfrances@gmail.com"
    }

  request(app)
    .post('/api/v1/users/signup')
    .send(user)
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(res, 'There is a response')
      t.equal(res.status, 201, 'HTTP 201 Created')
      t.equal(res.body.data, true, 'User sent = true')
      t.notEqual(res.status, 400, 'Not a 400 error')
      // console.log("res is", res.body)
      // console.log({res});
      t.end()
    })

})
