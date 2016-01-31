app.controller('ChatController', [
  '$scope', '$routeParams', 'chatService', 'socket',
  function($scope, $routeParams, chatService, socket) {
    $scope.view = 'chat';
    $scope.messages = [];
    $scope.chatRoomId = $routeParams.id || 1;
    $scope.sendMessage = function() {
      chatService.sendMessage($scope.chatRoomId, $scope.newMessage);
      $scope.newMessage = '';
    }
    if (!$scope.user) {
      chatService.getUser().then(function(results) {
        $scope.user = results.data;
      });
    }
    chatService.getMessages($scope.chatRoomId).then(function(results) {
      $scope.messages = results.data.messages;
    });
    socket.on('chat message', function(data) {
      if (data.chat_room == $scope.chatRoomId) {
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
