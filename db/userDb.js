var Knex = require('knex')
var knexConfig = ('../knexfile')[process.env.NODE_ENV || "development"]
var knex = Knex(knexConfig)
