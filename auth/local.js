const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ENV         = process.env.ENV || "development";
const init = require('./passport');
// const knex = require('../db/connection');
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const authHelpers = require('./_helpers');

const options = {};

init();

passport.use(new LocalStrategy(options, (username, password, done) => {
  // check to see if the username exists
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;
