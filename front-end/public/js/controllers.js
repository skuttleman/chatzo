app.controller('ChatController', [
  '$scope', '$routeParams', '$location', 'chatService',
  function($scope, $routeParams, $location, chatService) {
    $scope.view = 'chat';
    chatService.getUser().then(function(results) {
      $scope.user = results.data;
    });
    chatService.getMessages($routeParams.id || 1).then(function(results) {
      $scope.messages = results.data.messages;
    });
    chatService.messageSocket(function(data) {
      // $scope.socketData = data;
      console.log(data);
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
  }
]);
