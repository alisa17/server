
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({"username": "kfrn",
          "password": "admin",
          "email": "knfrances@gmail.com"}),
        knex('users').insert({ "username": "symeshjb",
          "password": "memes",
          "email": "symeshjb@gmail.com"
        }),
      ]);
    });
};
