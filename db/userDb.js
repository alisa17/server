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

getUserById = (id, callback) => {
  knex('users')
    .where('id', id)
    .then(res => callback(null, res))
}

module.exports = {
  getUsers,
  getUserByUsername,
  getUserByUsernameCb,
  createUser,
  getUserById
}
