app.controller('ChatController', [
  '$scope', '$routeParams', '$location', 'chatService',
  function($scope, $routeParams, $location, chatService) {
    $scope.view = 'chat';
    $scope.messages = [];
    chatService.getUser().then(function(results) {
      $scope.user = results.data;
    });
    chatService.getMessages($routeParams.id || 1).then(function(results) {
      $scope.messages = results.data.messages;
    });
    chatService.socketOn('chat message', function(data) {
      $scope.messages.push(data);
      while ($scope.messages.length > 100) $scope.messages.shift();
    });
    chatService.socketOn('user list', function(list) {
      $scope.userList = list;
      console.log(list);
    })
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
  }
]);
