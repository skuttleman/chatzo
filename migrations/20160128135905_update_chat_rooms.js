
exports.up = function(knex, Promise) {
  return knex.schema.table('chat_rooms', function(table) {
    table.string('name');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.bool('is_private').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('chat_rooms', function(table) {
    table.dropColumn('name');
    table.dropColumn('user_id');
    table.dropColumn('is_private');
  });
};
