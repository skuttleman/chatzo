// var chat = require('./chat');
var methods = require('./methods');
var socketIO, io;
var users = {
  getList: function() {
    var object = this;
    return Object.keys(object).reduce(function(list, key) {
      if (typeof object[key] == 'object') {
        methods.pushUnique(list, object[key], 'id');
      }
      return list;
    }, []);
  }
}

module.exports = function(server, user) {
  if (!io && user) {
    io = require('socket.io')(server);
    io.on('connection', function(socket) {
      users[socket.id] = user;
      io.emit('user list', { users: users.getList() });
      socket.on('disconnect', function() {
        delete users[socket.id];
        io.emit('user list', { users: users.getList() });
      });
    });
  }
  if (!socketIO) socketIO = {};
  if (io && (!socketIO.getUsers || !socketIO.broadcast)) {
    socketIO.getUsers = function() {
      return users.getList();
    };
    socketIO.broadcast = function(channel, data) {
      io.emit(channel, data);
    };
  }
  return socketIO;
};
