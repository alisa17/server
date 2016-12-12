# server
Server side for Flooki (originally One Shot).

#### Setup information:
* Clone down repo; install node modules with `npm install`
* Set up the database by running `knex migrate:latest` and `knex seed:run`
* Begin the server by running `npm start` (available at `http://localhost:3000/`)
* For live reloading, use `npm run start:dev`
* !NOTE Currently some tests are failing (this is expected - will be changed)

The API is fully documented [here](https://github.com/one-mile/server/blob/master/documentation.md).
