var socket = require('./socket')();
var knex = require('../db/knex');
var fs = require('fs');
var methods = require('./methods');
var shibley, shibleyisms;


module.exports = function(message) {
  if (shibley && shibleyisms) {
    var response = grepShibleyisms(message.message);
    if (response) {
      setTimeout(postResponse(response, message.chat_room_id), 2000);
    }
  }
};

function postResponse(response, chat_room_id) {
  return function() {
    var shibleyMessage = {
      user_id: shibley.id,
      chat_room_id: chat_room_id,
      message: response,
      created_at: new Date()
    };
    knex('messages').returning('*').insert(shibleyMessage).then(function(messages) {
      messages[0].user = shibley;
      socket.broadcast('chat message', messages[0]);
    });
  }
}

function grepShibleyisms(message) {
  var possibilities = [];
  message.split(' ').forEach(function(word) {
    word = word.replace(/[^a-z]/gi, '').toLowerCase();
    shibleyisms.triggered.filter(function(shibleyism) {
      return shibleyism.triggers.indexOf(word) >= 0;
    }).forEach(function(possibility) {
      possibility.responses.forEach(function(response) {
        methods.pushUnique(possibilities, response);
      });
    });
  });
  if (Math.floor(Math.random() * 100) == Math.floor(Math.random() * 100)) {
    possibilities = possibilities.concat(shibleyisms.random);
  }
  if (possibilities.length > 0) {
    return methods.randomElement(possibilities);
  }
}


// load shibley
knex('users').returning('*').where({ name: 'shib-bot', social_id: 0 }).then(function(users) {
  shibley = users[0];
}).catch(console.error);

// load shibleyisms
fs.readFile(__dirname + '/shibleyisms.json', 'utf8', function(err, data) {
  if (err) return console.error(err);
  shibleyisms = JSON.parse(data);
});
