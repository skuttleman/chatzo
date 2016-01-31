
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('image');
    table.dropColumn('is_logged_in');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('image');
    table.bool('is_logged_in');
  });
};
