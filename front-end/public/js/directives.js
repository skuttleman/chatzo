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
    controller: ['chatService', '$scope', function(chatService, $scope) {
      chatService.getRooms().then(function(results) {
        $scope.chatrooms = results.data.chat_rooms;
      });
    }],
    replace: true
  };
});
