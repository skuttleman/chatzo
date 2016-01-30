app.service('chatService', ['$http', function($http) {
  var socket = io();
  return {
    getUser: function() {
      return $http.get('/auth');
    },
    getMessages: function(chatroom) {
      var url = ['/api/chatrooms', chatroom, 'messages'].join('/');
      return $http.get(url);
    },
    getRooms: function() {
      return $http.get('/api/chatrooms');
    },
    socket: {
      send: function(message) {
        socket.emit('chat message', message);
      },
      receive: function(callback) {
        socket.on('chat message', callback);
      }
    }
  };
}]);

// var socket = io();
// socket.on('chat message', function(data) {
//   console.log(data);
// });
