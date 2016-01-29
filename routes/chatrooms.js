var route = require('express').Router();
var knex = require('../db/knex');
var messages = require('./messages');
module.exports = route;

// MESSAGES
route.use('/:id/messages', function(request, response, next) {
  canAccess(request.user, request.params.id).then(function() {
    request.chat_room_id = request.params.id;
    next();
  }).catch(function(err) {
    response.json({ message: 'Permission Denied' });
  });
}, messages);

// C
route.post('/', function(request, response, next) {
  if (request.user && request.user.id) {
    request.body.user_id = request.user.id;
    knex('chat_rooms').insert(request.body).then(function() {
      response.json({ success: true });
    }).catch(next);
  } else {
    next('You must be logged in to process this request');
  }
});

// R
route.get('/:id', function(request, response, next) {
  if (request.user && request.user.id) {
    knex('chat_rooms').where({ id: request.params.id, user_id: request.user.id })
    .then(function(chat_rooms) {
      if (chat_rooms.length) {
        return knex('users')
        .innerJoin('access', 'users.id', 'access.user_id')
        .where(function() {
          this.where('access.chat_room_id', request.params.id).orWhere('chat_rooms.is_private', false);
        }).then(function(chat_rooms) {
          response.json({ users: users, chat_rooms: chat_rooms });
        });
      } else {
        next('You do not have access to this chat room');
      }
    }).catch(next);
  } else {
    next('You must be logged in to process this request');
  }
});

// U
route.put('/:id', function(request, response, next) {
  knex('chat_rooms').where({ id: request.params.id }).then(function(chat_rooms) {
    if (request.user && request.user.id && chat_rooms[0].user_id == request.user.id) {
      request.body.user_id = request.user.id;
      return knex('chat_rooms').update(request.body).where({ id: request.params.id })
      .then(function(chat_rooms) {
        response.json({ chat_rooms: chat_rooms });
      });
    } else {
      next('You must be logged in to process this request');
    }
  }).catch(next);
});

// D
route.delete('/:id', function(request, response, next) {
  knex('chat_rooms').where({ id: request.params.id }).then(function(chat_rooms) {
    if (request.user && request.user.id && chat_rooms[0].user_id == request.user.id) {
      return knex('chat_rooms').where({ id: request.params.id }).del()
      .then(function(chat_rooms) {
        response.json({ success: true });
      });
    } else {
      next('You must be logged in to process this request');
    }
  }).catch(next);
});

// L
route.get('/', function(request, response, next) {
  if (request.user && request.user.id) {
    knex('chat_rooms').where({ user_id: request.user.id }).then(function(chat_rooms) {
      response.json({ chat_rooms: chat_rooms });
    }).catch(next);
  } else {
    next('You must be logged in to process this request');
  }
});

function canAccess(user, id) {
  return Promise.all([
    knex('chat_rooms').where({ id: id }),
    knex('access').select('user_id').where({ chat_room_id: id })
  ]).then(function(results) {
    if ((user && user.id == results[0][0].user_id) || results[1].indexOf(Number(id)) + 1) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  });
}
