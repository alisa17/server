var express = require('express');
//var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule')
var cors = require('cors')
var corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true
}
var passport = require('./passport')
var userDb = require('./db/userDb')

var users = require('./routes/users')
var entries = require('./routes/entries')

var app = express();

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(require('express-session')({ secret: 'the cake is a lie', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/v1/users', users)
app.use('/api/v1/entries', entries)

var rule = new schedule.RecurrenceRule()
rule.hour = 0

schedule.scheduleJob(rule, () => {
  console.log("inside sched job FN")
  resetShots()
  .then( () => {
    console.log("Shots reset!")
  })
  .catch( (err) => res.send(err) )
})

module.exports = app;
