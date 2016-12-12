
exports.up = function(knex, Promise) {
  knex.schema.createTableIfNotExists('comments', (table) => {
    table.increments('comment_id')
    table.integer('entry_id')
    table.integer('user_id')
    table.timestamp('comment_created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('comments')
};
