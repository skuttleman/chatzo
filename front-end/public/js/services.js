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
    socketOn: socket.on
  };
}]);
