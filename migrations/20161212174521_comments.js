
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('comments', (table) => {
    table.increments('comment_id')
    table.integer('entry_id')
    table.integer('user_id')
    table.string('comment')
    table.timestamp('comment_created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments')
};
