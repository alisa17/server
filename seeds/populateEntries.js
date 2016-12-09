
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('entries').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('entries').insert({user_id: 1, image_url: 'http://lwlcdn.lwlies.com/wp-content/uploads/2016/04/purple-rain-movie-prince-1108x0-c-default.jpg'}),
        knex('entries').insert({user_id: 2, image_url: 'http://i.amz.mshcdn.com/UI3fDiPu1wYlVyOtAonIY56dkGw=/950x534/2016%2F01%2F12%2F45%2Fdvdbwipc.5e777.jpg'}),
        knex('entries').insert({user_id: 3, image_url: 'http://www.northerntransmissions.com/wp-content/uploads/2015/02/clarence-clarity-1200x800.jpg'})
        knex('entries').insert({user_id: 2, image_url: 'https://500daysasunder.files.wordpress.com/2013/01/screen-shot-2013-01-24-at-3-53-49-pm.png?w=510&h=400'}),
      ]);
    });
};
