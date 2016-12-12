
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', (table) => {
    table.increments("id")
    table.string("username")
    table.integer("shotsRemaining").defaultTo(4)
    table.integer("follower_count").defaultTo(0)
    table.string("email")
    table.string("password")
    table.timestamp('user_created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
