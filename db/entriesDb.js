var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)

function getAllEntries() {
  return knex('entries')
          .select('entries.entry_id', 'entries.user_id', 'entries.image_url', 'entries.likes', 'entries.entry_created_at', 'users.id', 'users.username')
          .join('users', 'entries.user_id', 'users.id')
          .orderBy('entry_created_at', 'desc')
}

function getEntriesByUser(user_id) {
  return knex('entries').where('user_id', user_id).orderBy('entry_created_at', 'desc')
}

function addNewEntry(user_id, image_url) {
  return knex('entries').insert({user_id, image_url})
}

function increment(entry_id) {
  return knex('entries')
          .where('entry_id', entry_id)
          .then( (entry) => {
            var count = entry[0].likes
            return knex('entries').where('entry_id', entry_id).update('likes', count++)
          })
}


module.exports = {
  getAllEntries,
  getEntriesByUser,
  addNewEntry,
  increment
}

// Raw SQL: SELECT * FROM entries INNER JOIN users on entries.user_id=users.id ORDER BY entry_created_at DESC
// 'SELECT entries.entry_id, entries.user_id, entries.image_url, entries.likes, entries.entry_created_at, users.id, users.username FROM entries INNER JOIN users on entries.user_id=users.id ORDER BY entry_created_at DESC' <- excludes password
