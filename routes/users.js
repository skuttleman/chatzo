var route = require('express').Router();
var knex = require('../db/knex');
module.exports = route;


// R
route.get('/:id', function(request, response, next) {
  knex('users').where({ id: request.params.id }).then(function(users) {
    return knex('chat_rooms')
    .innerJoin('access', 'chat_rooms.id', 'access.chat_room_id')
    .where(function() {
      this.where('access.user_id', request.params.id).orWhere('chat_rooms.is_private', false);
    }).then(function(chat_rooms) {
      response.json({ users: users, chat_rooms: chat_rooms });
    });
  })
});

// L
route.get('/', function(request, response, next) {
  knex('users').then(function(users) {
    response.json({ users: users });
  });
});
