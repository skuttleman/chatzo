
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id');
      table.string('name');
      table.bool('is_logged_in');
    }),
    knex.schema.createTable('chat_rooms', function(table) {
      table.increments('id');
    })
  ]).then(function() {
    return knex.schema.createTable('access', function(table) {
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.integer('chat_room_id').references('id').inTable('chat_rooms').onDelete('CASCADE');
      table.primary(['user_id', 'chat_room_id']);
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('access').then(function() {
    return Promise.all([
      knex.schema.droptTableIfExists('chat_rooms'),
      knex.schema.droptTableIfExists('users')
    ]);
  });
};
