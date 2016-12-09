var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)

function getAllEntries() {
  return knex('entries').orderBy('created_at', 'desc')
}

function getEntriesByUser(user_id) {
  return knex('entries').where('user_id', user_id).orderBy('created_at', 'desc')
}

function addNewEntry(user_id, image_url) {
  return knex('entries').insert({user_id, image_url})
}

function increment(entry_id) {
  return knex('entries')
          .where('id', entry_id)
          .then( (entry) => {
            var count = entry[0].likes
            return knex('entries').where('id', user_id).update('likes', count++)
          })
}


module.exports = {
  getAllEntries,
  getEntriesByUser,
  addNewEntry,
  increment
}
