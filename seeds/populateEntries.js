
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('entries').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('entries').insert({user_id: 1, image_url: 'http://lwlcdn.lwlies.com/wp-content/uploads/2016/04/purple-rain-movie-prince-1108x0-c-default.jpg'}),
        knex('entries').insert({user_id: 1, image_url: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/11/13/bowie2.jpg'}),
        knex('entries').insert({user_id: 1, image_url: 'http://www.interviewmagazine.com/files/2011/05/23/img-kate-bush-2_131701607586.jpg'}),
        knex('entries').insert({user_id: 2, image_url: 'http://i.amz.mshcdn.com/UI3fDiPu1wYlVyOtAonIY56dkGw=/950x534/2016%2F01%2F12%2F45%2Fdvdbwipc.5e777.jpg'}),
        knex('entries').insert({user_id: 2, image_url: 'http://www.northerntransmissions.com/wp-content/uploads/2015/02/clarence-clarity-1200x800.jpg'}),
        knex('entries').insert({user_id: 2, image_url: 'http://vignette2.wikia.nocookie.net/teenage-mutant-ninja-turtles-2012-series/images/c/cc/Krang_Found_The_Ninja_Turtles_And_1987_Turtles.jpg/revision/latest?cb=20160407013045'}),
        knex('entries').insert({user_id: 4, image_url: 'http://i.imgur.com/lTO9Plf.png'}),
        knex('entries').insert({user_id: 4, image_url: 'http://islamic-arts.org/wp-content/uploads/2011/10/2546291292-360x225.jpg'}),
        knex('entries').insert({user_id: 4, image_url: 'https://bleepbloopblipblog.files.wordpress.com/2015/04/maxresdefault.jpg?w=1280'}),
        knex('entries').insert({user_id: 3, image_url: 'https://ksr-ugc.imgix.net/assets/005/732/412/91c1e1b9ff2da9ac48091d719024f602_original.jpg?w=680&fit=max&v=1460821145&auto=format&q=92&s=dcd65d0b7a039acf07a87043a7695507'}),
        knex('entries').insert({user_id: 3, image_url: 'http://www.magritte.be/dpics/oeuvres/2015-08-20-05-48-39_MagritteLatrahisondeimage.jpg'}),
        knex('entries').insert({user_id: 3, image_url: 'http://cdn1.matadornetwork.com/blogs/1/2015/04/pobre-venadito-600x445.jpg'}),

      ]);
    });
};
