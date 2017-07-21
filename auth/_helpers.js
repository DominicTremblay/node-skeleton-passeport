const bcrypt      = require('bcrypt');
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser (req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return knex('users')
  .insert({
    name: req.body.name,
    username: req.body.username,
    password: hash
  })
  .returning('*');
}

module.exports = {
  comparePass,
  createUser
};