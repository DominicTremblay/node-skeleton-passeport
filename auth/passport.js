const passport    = require('passport');
// const knex = require('../db/connection');
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    knex('users').where({id}).first()
    .then((user) => { done(null, user); })
    .catch((err) => { done(err,null); });
  });

};