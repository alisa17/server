var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)

getUsers = () => {
  return knex('users')
}

getUserByUsername = (username) => {
  return knex('users').where('username', username)
}

createUser = (username, password, email) => {
  return knex('users').insert({username, password, email})
}

getUserById = (id) => {
  return knex('users').where('id', id)
}

module.exports = {
  getUsers,
  getUserByUsername,
  createUser,
  getUserById
}
