const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const schedule = require('node-schedule')
const cors = require('cors')
const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true
}
const passport = require('./passport')
const users = require('./routes/users')
const entries = require('./routes/entries')
const resetShots = require('./db/userDb').resetShots

const app = express()

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({ secret: 'the cake is a lie', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1/users', users)
app.use('/api/v1/entries', entries)

var rule = new schedule.RecurrenceRule()
rule.hour = 0

schedule.scheduleJob(rule, () => {
  console.log('inside sched job FN')
  resetShots()
  .then(() => {
    console.log('Shots reset!')
  })
  .catch((err) => console.log(err))
})

module.exports = app
