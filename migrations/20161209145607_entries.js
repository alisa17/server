
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('entries', (table) => {
    table.increments('entry_id')
    table.integer('user_id')
    table.string('image_url')
    table.integer('likes').defaultTo(0)
    table.timestamp('entry_created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('entries')
};
