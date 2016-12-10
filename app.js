var express = require('express');
//var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var passport = require('./passport')

var users = require('./routes/users')
var entries = require('./routes/entries')

var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(require('express-session')({ secret: 'the cake is a lie', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/v1/users', users)
app.use('/api/v1/entries', entries)


// app.post('/users/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => res.redirect('/home'))

module.exports = app;
