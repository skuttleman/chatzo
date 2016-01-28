
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('social_id');
  }).then(function() {
    return knex.schema.table('users', function(table) {
      table.string('social_id');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('social_id');
  }).then(function() {
    return knex.schema.table('users', function(table) {
      table.integer('social_id');
    });
  });
};
