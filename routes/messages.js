var route = require('express').Router();
var knex = require('../db/knex');
var socket = require('../services/socket')();
var shibBot = require('../services/shib-bot');
module.exports = route;

// C
route.post('/', function(request, response, next) {
  var message = {
    user_id: request.user.id,
    chat_room_id: request.chat_room_id,
    message: request.body.message,
    created_at: new Date()
  };
  knex('messages').returning('*').insert(message).then(function(messages) {
    messages[0].user = request.user;
    socket.broadcast('chat message', messages[0]);
    shibBot(message);
    response.json({ success: true });
  }).catch(next);
});

// R
route.get('/:id', function(request, response, next) {
  knex('messages').where({ id: request.params.id, chat_room_id: request.chat_room_id })
  .then(function(messages) {
    return knex('users').where({ id: messages[0].user_id }).then(function(users) {
      return Promise.resolve({ message: messages, user: users[0] });
    });
  }).then(function(results) {
    results.messages[0].user = results.user;
    response.json({ messages: results.messages });
  }).catch(next);
});

// U
route.put('/:id', function(request, response, next) {
  var message = {
    updated_at: new Date(),
    message: request.body.message
  };
  knex('messages').where({ id: request.params.id }).then(function(messages) {
    if (messages[0].user_id == request.user.id) {
      return knex('messages').returning('*').update(message).where({ id: request.params.id });
    } else {
      return Promise.reject('You do not have permission to update this message');
    }
  }).then(function(messages) {
    messages[0].user = request.user;
    socket.broadcast('update message', messages[0])
    response.json({ success: true });
  }).catch(next);
});

// D
route.delete('/:id', function(request, response, next) {
  knex('messages').where({ id: request.params.id }).then(function(messages) {
    return knex('messages').where({ id: request.params.id, user_id: request.user.id })
    .del().then(function() {
      return Promise.resolve(messages[0]);
    });
  }).then(function(message) {
    socket.broadcast('delete message', { id: message.id, chat_room_id: message.chat_room_id });
    response.json({ sucess: true });
  }).catch(next);
});

// L
route.get('/', function(request, response, next) {
  Promise.all([
    knex('messages').where({ chat_room_id: request.chat_room_id }).orderBy('created_at', 'desc').limit(100),
    knex('users')
  ]).then(function(results) {
    results[0].reverse();
    results[0].forEach(function(message) {
      message.user = results[1].filter(function(user) {
        return user.id == message.user_id;
      })[0];
    });
    response.json({ messages: results[0] });
  }).catch(next);
});
