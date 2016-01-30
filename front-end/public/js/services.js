app.service('chatService', ['$http', function($http) {
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
    getLoggedInUsers: function() {
      return $http.get('/api/users/logged-in');
    },
    sendMessage(chatroom, message) {
      var url = ['/api/chatrooms', chatroom, 'messages'].join('/');
      return $http.post(url, { message: message })
    }
  };
}]).factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);
