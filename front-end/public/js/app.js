var app = angular.module('chatzo', ['ngRoute', 'mm.foundation']);
app.config(['$routeProvider', function(route) {
  route.when('/', {
    templateUrl: 'templates/chat.html',
    controller: 'ChatController'
  }).when('/chatrooms', {
    templateUrl: 'templates/chatrooms.html',
    controller: 'ChatroomsController'
  }).when('/chatrooms/create', {
    templateUrl: 'templates/chatrooms-form.html',
    controller: 'ChatroomsController'
  }).when('/chatrooms/:id', {
    templateUrl: 'templates/chat.html',
    controller: 'ChatController'
  }).when('/chatrooms/:id/update', {
    templateUrl: 'templates/chatrooms-form.html',
    controller: 'ChatroomsController'
  })

// otherwise
  .otherwise('/');
}]);
