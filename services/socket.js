var socketIO;
var users = {};
var io;

module.exports = function(server, user) {
  if (!io && user) {
    io = require('socket.io')(server);

    io.on('connection', function(socket) {
      users[socket.id] = user;
      io.emit('chat message', { message: user.name + ' has entered the room.' });
      socket.on('disconnect', function() {
        delete users[socket.id];
        io.emit('chat message', { message: user.name + ' has left the room' });
      });
    });
  }



  if (!socketIO) {
    socketIO = {
      getUsers: function() {
        return users;
      }
    };
  }
  return socketIO;
};
