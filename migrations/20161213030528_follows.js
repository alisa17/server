
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('follows', (table) => {
    table.increments('id')
    table.integer('followed_user_id')
    table.integer('following_user_id')

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('follows')
};
