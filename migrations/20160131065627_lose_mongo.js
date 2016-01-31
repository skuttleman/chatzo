
exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id');
    table.string('message');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('chat_room_id').references('id').inTable('chat_rooms').onDelete('CASCADE');
    table.datetime('created_at');
    table.datetime('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('messages');
};
