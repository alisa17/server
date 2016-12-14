
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({'username': 'kfrn',
          'password': '$2a$10$gSVzEAHaxw2dZD2gYU.BneOfB/y./SXMiUXiWwJYwiqfWw5UahMI6',
          'email': 'knfrances@gmail.com'}),
        knex('users').insert({ 'username': 'symeshjb',
          'password': '$2a$10$lFKCidwWcWJhsQdQVjlob.4hIVw/dBXm.pqCwfeXoq//gZWoI5L/a',
          'email': 'symeshjb@gmail.com'
        }),
        knex('users').insert({ 'username': 'mel',
          'password': '$2a$10$hCfQbc9zYq6iP0ZWnLtF9O96.ti9NUZwanOZ9n84e4wUqs82n6jLO',
          'email': 'mel@mel.com'
        }),
        knex('users').insert({ 'username': 'ursula',
          'password': '$2a$10$hCfQbc9zYq6iP0ZWnLtF9O96.ti9NUZwanOZ9n84e4wUqs82n6jLO',
          'email': 'ursula@gmail.com'
        })

      ])
    })
}
