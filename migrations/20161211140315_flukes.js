
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('flukes', (table) => {
    table.increments('fluke_id')
    table.integer('fluked_entry_id')
    table.integer('user_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('flukes')
};
