
exports.up = function(knex, Promise) {
  return knex.schema.table('messages', function(table) {
    table.dropColumn('message');
  }).then(function() {
    return knex.schema.table('messages', function (table) {
      table.text('message');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('messages', function(table) {
    table.dropColumn('message');
  }).then(function() {
    return knex.schema.table('messages', function (table) {
      table.string('message');
    });
  });
};
