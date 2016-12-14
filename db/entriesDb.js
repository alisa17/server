var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)

function getAllEntries() {
  return knex('entries')
          .select('entries.entry_id', 'entries.user_id', 'entries.image_url', 'entries.flukes', 'entries.entry_created_at', 'users.id', 'users.username', 'entries.comment_count')
          .join('users', 'entries.user_id', 'users.id')
          .orderBy('entry_created_at', 'desc')
}

function getEntriesByUser(user_id) {
  return knex('entries')
          .join('users', 'entries.user_id', 'users.id')
          .where('user_id', user_id)
          .orderBy('entry_created_at', 'desc')
}

function addNewEntry(user_id, image_url) {
  return knex('entries').insert({user_id, image_url})
}

function increment(entry_id, user_id) {
  return knex('entries')
          .where('entry_id', entry_id)
          .then( (entry) => {
            var count = entry[0].flukes
            return knex('entries')
                    .where('entry_id', entry_id)
                    .update('flukes', count + 1)
                    .then( () => {
                      return addFluke(entry_id, user_id)
                    })
          })
}

function decrement(entry_id, user_id) {
  return knex('entries')
          .where('entry_id', entry_id)
          .then( (entry) => {
            var count = entry[0].flukes
            return knex('entries')
                    .where('entry_id', entry_id)
                    .update('flukes', count - 1)
                    .then( () => {
                      return deleteFluke(entry_id, user_id)
                    })
          })
}

function checkAlreadyFluked(fluked_entry_id, user_id) {
  return knex('flukes')
          .where('fluked_entry_id', fluked_entry_id)
          .andWhere('user_id', user_id)
}

function addFluke(fluked_entry_id, user_id) {
  return knex('flukes').insert({fluked_entry_id, user_id})
}

function deleteFluke(fluked_entry_id, user_id) {
  return knex('flukes')
          .where('fluked_entry_id', fluked_entry_id)
          .andWhere('user_id', user_id)
          .del()
}

function myFlukes(user_id) {
  return knex('flukes')
          .where('user_id', user_id)
}

function getComments(entry_id) {
  return knex('comments')
    .join('users', 'users.id', 'comments.user_id')
    .where('entry_id', entry_id)
}

function incrementCommentCount(entry_id) {
  return knex('entries')
          .where('entry_id', entry_id)
          .then( (entry) => {
            var count = entry[0].comment_count
            return knex('entries')
                    .where('entry_id', entry_id)
                    .update('comment_count', count + 1)
          })
}

function newComment({entry_id, user_id, comment}) {
  return knex('comments')
    .insert({entry_id, user_id, comment})
}

module.exports = {
  getAllEntries,
  getEntriesByUser,
  addNewEntry,
  increment,
  decrement,
  checkAlreadyFluked,
  addFluke,
  deleteFluke,
  myFlukes,
  getComments,
  incrementCommentCount,
  newComment

}
