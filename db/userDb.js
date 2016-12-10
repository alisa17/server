var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)

getUsers = () => {
  return knex('users')
}

getUserByUsername = (username) => {
  return knex('users')
    .where('username', username)
}


getUserByUsernameCb = (username, callback) => {
  knex('users')
    .where('username', username)
    .then(res => callback(null, res))
}

createUser = (username, password, email) => {
  return knex('users').insert({username, password, email})
}

getUserById = (id) => {
   return knex('users')
    .where('id', id)
}

decrement = (user_id) => {
  return knex('users')
          .where('id', user_id)
          .then( (user) => {
            var count = user[0].shotsRemaining
            if (count === 0) {
              return 0
            } else {
              return knex('users').where('id', user_id).update("shotsRemaining", count - 1)
            }
          })
}

module.exports = {
  getUsers,
  getUserByUsername,
  getUserByUsernameCb,
  createUser,
  getUserById,
  decrement
}
