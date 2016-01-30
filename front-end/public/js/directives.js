app.directive('chatzoHeader', function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/header.html',
    replace: true
  };
})

app.directive('chatzoList', function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/chatrooms.html',
    scope: {
      // chatrooms: '='
    },
    controller: ['chatService', 'socket', '$scope', function(chatService, socket, $scope) {
      chatService.getRooms().then(function(results) {
        $scope.chatrooms = results.data.chat_rooms;
      });
      chatService.getLoggedInUsers().then(function(data) {
        $scope.userList = data.users;
      });
      socket.on('user list', function(data) {
        $scope.userList = data.users;
      });
    }],
    replace: true
  };
});
