const test = require('tape')
const request = require('supertest')
const agent = require('superagent')
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
    .post('/api/v1/users/login')
    .send({ username: 'kfrn', password: 'admin' })
    .end(function(err, res) {
      console.log(res.req);
      request(app)
        .get('/api/v1/users')

        .expect(200)
        .end( (err, res) => {
          t.false(err, 'There is no error')
          t.true(Object.keys(res.body).length != 0, 'There is a response')
          t.true(res.body.hasOwnProperty('users'), 'There is a users key in the object returned from /users')
          t.true(res.body.users[0].hasOwnProperty('username'), 'The first obj in the "users" array has the key "username"')
          t.deepEqual(res.body.users[0], expected.users[0], 'Res.body should match expected structure')
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
      console.log(res.body);
      t.true(Object.keys(res.body.user).length != 0, 'There is a response')
      t.true(res.body.hasOwnProperty("user"), 'Response has the key user')
      t.deepEqual(Object.keys(res.body.user), keys, "Response has the correct keys for the user object")
      t.end()
    })

})
