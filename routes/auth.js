var route = require('express').Router();
var passport = require('passport');
var knex = require('../db/knex');

module.exports = route;

route.get('/auth', function(request, response) {
  response.json({ user: request.user });
});

route.get('/auth/google', passport.authenticate('google'));

route.get('/auth/google/callback',
  passport.authenticate('google'),
  function(request, response, next) {
    response.redirect('/');
  }
);

route.get('/auth/logout', function(request, response, next) {
  request.logout();
  response.json({ user: request.user });
});
