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
      t.true(res.body.hasOwnProperty('users'), 'There is a users key in the object returned from /users')
      t.true(res.body.users[0].hasOwnProperty('username'), 'The first obj in the "users" array has the key "username"')
      t.deepEqual(res.body, expected, 'Res.body should match expected structure')
      t.end()
    })
})
