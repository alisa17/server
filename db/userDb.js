const Knex = require('knex')
const config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
const knex = Knex(config)

const getUsers = () => {
  return knex('users')
}

var getUserByUsername = (username) => {
  return knex('users')
    .where('username', username)
}

var getUserByUsernameCb = (username, callback) => {
  knex('users')
    .where('username', username)
    .then(res => callback(null, res))
}

var createUser = (username, password, email) => {
  return knex('users').insert({username, password, email})
}

var getUserById = (id) => {
  return knex('users')
    .where('id', id)
}

var decrement = (user_id) => {
  return knex('users')
          .where('id', user_id)
          .then((user) => {
            var count = user[0].shotsRemaining
            if (count === 0) {
              return 0
            } else {
              return knex('users').where('id', user_id).update('shotsRemaining', count - 1)
            }
          })
}

var resetShots = () => {
  return knex('users')
    .update('shotsRemaining', 4)
}

module.exports = {
  getUsers,
  getUserByUsername,
  getUserByUsernameCb,
  createUser,
  getUserById,
  decrement,
  resetShots
}
