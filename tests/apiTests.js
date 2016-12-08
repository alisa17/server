const test = require('tape')
const request = require('supertest')
const app = require('../app')

test('Can get users from /api/v1/users', t => {
  request(app)
    .get('/api/v1/users')
    .end( (err, res) => {
      t.false(err, 'There is no error')
      t.true(res, 'There is a response')
      t.true(res.body.hasOwnProperty('users'), 'There is a users key in the object returned from /users')
      t.end()
    })
})
