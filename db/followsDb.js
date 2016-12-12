var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)




//get list of followers of a user
function followerList(user_id) {
  return knex('follows')
    .join('users', 'users.id', user_id)
    .where('follows.following_user_id', user_id)
}

function followingUsers(user_id) {
  return knex('follows')
    .where('following_user_id', user_id)
}

function getFollowingEntries(list) {
  return knex('entries')
    .whereIn('user_id', list)
    .join('users', 'users.id', 'entries.user_id')

}

function newFollow(following_user_id, followed_user_id) {
  return knex('follows')
    .insert({following_user_id, followed_user_id})
    .then((follow_id) => {
      return incrementFollowerCount(followed_user_id, 1)
    })
}

function unFollow(following_user_id, followed_user_id) {
  return knex('follows')
    .where('following_user_id', following_user_id)
    .andWhere('followed_user_id', followed_user_id)
    .del()
    .then((follow_id) => {
      return incrementFollowerCount(followed_user_id, -1)
    })
}

function incrementFollowerCount(user_id, increment) {
  return knex('users').where('users.id', user_id)
    .then((user) => {
      return knex('users')
        .update('follower_count', (user[0].follower_count || 0 )+ increment)
        .where('id', user_id)
    })
}

module.exports = {
  followerList,
  getFollowingEntries,
  newFollow,
  unFollow,
  followingUsers
}
