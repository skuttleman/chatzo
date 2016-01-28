var express = require('express'), app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var io = require('socket.io');

var port = process.env.PORT || 8000;

var users = require('./routes/users');
var chatrooms = require('./routes/chatrooms');
var messages = require('./routes/messages');


app.listen(port, function() {
  console.log('Server is listening on port', port);
});
