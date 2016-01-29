var route = require('express').Router();
var mongo = require('../db/mongo');
var knex = require('../db/knex');
module.exports = route;

// C
route.post('/', function(request, response, next) {
  mongo.connect().then(function(db) {
    request.body.user_id = request.user.id;
    request.body.chat_room_id = request.chat_room_id;
    request.body.created_at = Date();
    db.collection('messages').insert(request.body, function(err, data) {
      if (err) return next(err);
      response.json({ success: !!data.result.ok });
      db.close();
    });
  }).catch(next);
});

// R
route.get('/:id', function(request, response, next) {
  Promise.all([
    knex('users'),
    mongo.connect()
  ]).then(function(results) {
    var users = results[0], db = results[1],
      find = { _id: mongo.ObjectId(request.params.id), chat_room_id: request.chat_room_id };
    db.collection('messages').findOne(find, function(err, message) {
      if (err) return next(err);
      message.user = users.filter(function(user) {
        return user.id == message.user_id;
      })[0];
      response.json({ messages: [message] });
      db.close();
    });
  }).catch(next);
});

// U
route.put('/:id', function(request, response, next) {
  mongo.connect().then(function(db) {
    request.body.user_id = request.user.id;
    request.body.updated_at = Date();
    var find = { _id: mongo.ObjectId(request.params.id), chat_room_id: request.chat_room_id };
    db.collection('messages').updateOne(find, { $set: request.body }, function(err, data) {
      if (err) return next(err);
      response.json({ success: !!data.results.nModified });
      db.close();
    });
  }).catch(next);
});

// D
route.delete('/:id', function(request, response, next) {
  mongo.connect().then(function(db) {
    var find = { _id: mongo.ObjectId(request.params.id), chat_room_id: request.chat_room_id };
    db.collection('messages').remove(find, function(err, data) {
      if (err) return next(err);
      response.json({ success: true });
      db.close();
    });
  }).catch(next);
});

// L
route.get('/', function(request, response, next) {
  Promise.all([
    knex('users'),
    mongo.connect()
  ]).then(function(results) {
    var users = results[0], db = results[1],
      find = { chat_room_id: request.chat_room_id };
    db.collection('messages').find(find).toArray(function(err, messages) {
      if (err) return next(err);
      messages.forEach(function(message) {
        message.user = users.filter(function(user) {
          return user.id == message.user_id;
        })[0];
      });
      response.json({ messages: messages });
      db.close();
    });
  }).catch(next);
});
