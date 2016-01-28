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
  callbackURL: process.env.HOST + "/auth/google/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
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

function userWithRole(user, where) {
  return lookupRole(where).then(function(role) {
    user.role_name = role.name;
    return Promise.resolve(user);
  });
}

function updateUser(user, profile) {
  return knex('members').returning('*').where({ id: user.id }).update({
    display_name: profile.displayName || '',
    profile_image: photo(profile.photos)
  }).then(function(users) {
    return userWithRole(users[0], { id: user.role_id });
  });
}

function createUser(profile) {
  return lookupRole({ name: 'normal' }).then(function(role) {
    return knex('members').returning('*').insert({
      is_banned: false,
      role_id: role.id,
      social_id: profile.id,
      display_name: profile.displayName,
      profile_image: photo(profile.photos)
    }).then(function(users) {
      var user = users[0];
      user.role_name = role.name;
      user.firstLogin = true;
      return Promise.resolve(user);
    });
  });
}

function photo(photos) {
  var ret = photos[photos.length - 1];
  return ret ? ret.value : '';
}
