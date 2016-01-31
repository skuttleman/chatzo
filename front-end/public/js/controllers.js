app.controller('ChatController', [
  '$scope', '$routeParams', 'chatService', 'socket',
  function($scope, $routeParams, chatService, socket) {
    $scope.view = 'chat';
    $scope.messages = [];
    $scope.chatRoomId = $routeParams.id || 1;
    $scope.sendMessage = function() {
      chatService.sendMessage($scope.chatRoomId, $scope.newMessage);
      $scope.newMessage = '';
    };
    $scope.condense = function() {
      var index = this.$index;
      var previous = $scope.messages[index - 1];
      return previous &&
        this.message.user_id == previous.user_id &&
        since(this.message, previous) <= 2;
    };
    if (!$scope.user) {
      chatService.getUser().then(function(results) {
        $scope.user = results.data;
      });
    }
    chatService.getMessages($scope.chatRoomId).then(function(results) {
      $scope.messages = results.data.messages;
    });
    socket.on('chat message', function(data) {
      if (data.chat_room_id == $scope.chatRoomId) {
        $scope.messages.push(data);
        while ($scope.messages.length > 100) $scope.messages.shift();
      }
    });
  }
]);

app.controller('ChatroomsController', [
  '$scope', '$routeParams', '$location', 'chatService',
  function($scope, $routeParams, $location, chatService) {
    $scope.view = 'chatrooms';
    if (!$scope.user) {
      chatService.getUser().then(function(results) {
        $scope.user = results.data;
      });
    }
    chatService.getLoggedInUsers().then(function(data) {
      $scope.userList = data.users;
    });
    chatService.socketOn('user list', function(data) {
      $scope.userList = data.users;
    });
  }
]);

function since(message1, message2) {
  var date1 = new Date(message1.created_at), date2 = new Date(message2.created_at);
  return Math.abs(date1.getTime() - date2.getTime()) / 60000;
}
