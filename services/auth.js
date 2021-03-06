var route = require('express').Router();
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var knex = require('../db/knex');

module.exports = route;


route.use(session({
  secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
route.use(passport.initialize());
route.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  incorporateUser(profile, done).catch(done);
}));

function incorporateUser(profile, done) {
  return getOrCreateUser(profile).then(function(user) {
    done(null, user);
  });
}

function getOrCreateUser(profile) {
  return knex('users').where('social_id', profile.id).then(function(users) {
    var user = users[0];
    if (user) {
      return updateUser(user, profile);
    } else {
      return createUser(profile);
    }
  });
}

function updateUser(user, profile) {
  return knex('users').returning('*').where({ id: user.id }).update({
    name: profile.displayName || '',
    image: photo(profile.photos)
  }).then(function(users) {
    return Promise.resolve(users[0]);
  });
}

function createUser(profile) {
  return knex('users').returning('*').insert({
    social_id: profile.id,
    name: profile.displayName,
    image: photo(profile.photos)
  }).then(function(users) {
    return Promise.resolve(users[0]);
  });
}

function photo(photos) {
  var photo = photos[photos.length - 1];
  var value = popSz(photo ? photo.value : '');
  return value;
}

function popSz(string) {
  var array = string.split('?');
  if (array.length > 1) array.pop();
  return array.join('?');
}
