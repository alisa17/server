
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('follows').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('follows').insert({followed_user_id: 1, following_user_id: 2}),
        knex('follows').insert({followed_user_id: 1, following_user_id: 3}),
        knex('follows').insert({followed_user_id: 1, following_user_id: 4}),
        knex('follows').insert({followed_user_id: 2, following_user_id: 1}),
        knex('follows').insert({followed_user_id: 2, following_user_id: 4}),
        knex('follows').insert({followed_user_id: 2, following_user_id: 3}),
        knex('follows').insert({followed_user_id: 3, following_user_id: 1}),
        knex('follows').insert({followed_user_id: 3, following_user_id: 2}),
        knex('follows').insert({followed_user_id: 3, following_user_id: 4}),
        knex('follows').insert({followed_user_id: 4, following_user_id: 1})
      ]);
    });
};
