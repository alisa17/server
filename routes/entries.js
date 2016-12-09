var express = require('express')
var router = express.Router()
var passport = require('../passport')
var entriesDb = require('../db/entriesDb')

ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("yes");
    return next()
  } else {
    res.status(401)
    console.log("fail");
    res.send({"users": "Invalid Permissions"})
  }
}
