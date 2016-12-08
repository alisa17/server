var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('./passport')

var users = require('./routes/users');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
// app.use(express.session({ secret: 'keyboard cat' }));

app.use('/api/v1/users', users);


// app.post('/users/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => res.redirect('/home'))

module.exports = app;
