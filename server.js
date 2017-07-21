"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 3000;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const hbs         = require('express-handlebars');
const passport    = require('passport');
const session     = require('express-session');
const cookieParser =require('cookie-parser');
const flash       = require('flash');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const authRoutes  = require("./routes/auth.js")

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.engine('hbs', hbs({extname: 'hbs',
                       defaultLayout: 'layout',
                       layoutsDir: __dirname + '/views/layouts'}));

// app.set("view engine", "ejs");
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static(__dirname + "/public"));

// set redirections to boostrap and jquery

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

console.log(__dirname + '/node_modules/jquery/dist');

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/auth", authRoutes(knex));

// Home page
app.get("/", (req, res) => {

  const famousPeople = [
    {firstName: "Abraham", lastName: "Lincoln"},
    {firstName: "Ernest", lastName: "Hemingway"}
  ]

  res.render("index", {title: "Famous People", famousPeople: famousPeople});
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
