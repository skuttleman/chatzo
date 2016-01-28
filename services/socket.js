var socketIO;

module.exports = function(server) {
//   var io = require('socket.io').io(server);
//   var users: [], typers: [];
//
//   io.on('connection', function(socket) {
//   var entered = makeResponse({ user: 'ALERT', message: 'Someone entered the chatroom!' });
//   io.emit('chat message', entered);
//   socket.on('chat message', function(data) {
//     var response = makeResponse(data);
//     io.emit('chat message', response);
//   });
//   socket.on('typing', function(data) {
//     var string = data.user ? data.user + ' is typing...' : '';
//     io.emit('typing', string);
//   });
//   socket.on('disconnect', function() {
//     io.emit('chat message', makeResponse({ user: 'ALERT', message: 'Someone left the chatroom!' }));
//   });
// });



  if (!socketIO) {
    socketIO = {

    };
  }
  return socketIO;
};
