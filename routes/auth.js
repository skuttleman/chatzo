var route = require('express').Router();
var passport = require('passport');
var knex = require('../db/knex');

module.exports = route;

route.get('/', function(request, response) {
  response.json({ user: request.user });
});

route.get('/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/userinfo.profile' })
);

route.get('/google/callback',
  passport.authenticate('google'),
  function(request, response, next) {
    response.redirect('/');
  }
);

route.get('/logout', function(request, response, next) {
  request.logout();
  response.json({ message: 'logged out' });
});
