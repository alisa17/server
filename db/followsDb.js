var Knex = require('knex')
var config = require('../knexfile')[ process.env.NODE_ENV || 'development' ]
var knex = Knex(config)

function followingList(user_id) {
  return knex('follows')
    .join('users', 'users.id', user_id)
    .where('follows.followed_user_id', user_id)
}

//get list of followers of a user
function followerList(user_id) {
  return knex('follows')
    .join('users', 'users.id', user_id)
    .where('follows.following_user_id', user_id)
}

function getFollowingEntries(user_id) {
  return followingList(user_id)
    .then((following) => {
      var list = following.map((follow) => {
        return follow.following_user_id
      })
      return knex('entries')
              .select('entries.entry_id', 'entries.user_id', 'entries.image_url', 'entries.flukes', 'entries.entry_created_at', 'users.id', 'users.username', 'entries.comment_count')
              .join('users', 'entries.user_id', 'users.id')
              .whereIn('entries.user_id', list)
              .orderBy('entry_created_at', 'desc')
    })
}

function newFollow(following_user_id, followed_user_id) {
  return knex('follows')
    .insert({following_user_id, followed_user_id})
    .then((follow_id) => {
      incrementFollowerCount(following_user_id, 1)
    })
}

function unFollow(following_user_id, followed_user_id) {
  return knex('follows')
    .where('following_user_id', following_user_id)
    .andWhere('followed_user_id', followed_user_id})
    .del()
    .then((follow_id) => {
      incrementFollowerCount(following_user_id, -1)
    })
}

function incrementFollowerCount(user_id, increment) {
  return knex('users')
    .where('id',user_id)
    .then((user) => {
      return knex('users')
        .update('follower_count', user.follower_count + increment)
        .where('id', user_id)
    })
}

module.exports = {
  followingList,
  followerList,
  getFollowingEntries,
  newFollow,
  unFollow
}
