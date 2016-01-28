
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.integer('social_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('social_id');
  });
};
