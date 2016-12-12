# API Documentation

#### Authors

* Harrison Symes
* Katherine Nagels

## Background

API for use with the "One-Shot" app project. Requests marked 'AU' require authentication.

##### The API can:
| Task | Method |
| ------ | -------- |
| Return a list of all users | GET |
| Create a new user | POST |
| Log in as a user | POST |
| Return a list of all photo entries | GET |
| Add a new photo entry | POST |
| Return all photo entries by a specific user | GET |
| Fluke/unfluke (like or dislike) a specific post | POST |
| Delete an entry - tba!!!!!!| POST |


## Requests

### Return list of all users (AU)

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET | `/v1/users` | Get list of all users | users |

#### Response

##### Status Codes:
  * On success, the HTTP status code in the response header is 200 ('OK').
  * In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The get request will return an object with the key "users", containing an array of the user objects

    {
      "users":
        [
          {
            "username": "kfrn",
            "user_id": 1
          },
          {
            "username": "symeshjb",
            "user_id": 4
          }
        ]
    }

If a non-authenticated user attempts this, the result will be:

     {
     "data": "Invalid Permissions"
     }

### Create new user


| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/users/signup` | Create a user | boolean |

The post object must take the form:

    {
      "username": "kfrn",
      "password": "admin",
      "email": "knfrances@gmail.com"
    }

#### Response
##### Status Codes:

  * On success, the HTTP status code in the response header is 201 ('Created').
  * If the data passed in is incorrect, a 400 'Bad Response' HTTP status code will be returned.
  * In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The post request will add a new user row to the user table based on the form inputs. It will reject the request if the username is already taken, and return a falsey. The password will be hashed, and the database stores only this hashed version. If the user creation is successful, that user's ID will be returned, e.g.:

    { "user_id": 3 }

### Login as user

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/users/login` | Authenticate a user | user |

The post object must take the form:

    {
      "username": "kfrn",
      "password": "admin"
    }

#### Response

##### Status Codes:
  * On success, the HTTP status code in the response header is 200 ('OK').
  * If the login information is invalid (username doesn't exist / password is incorrect), a 401 'Unauthorized' HTTP status code will be returned.
  * If the data passed in is incorrect, a 400 'Bad Response' HTTP status code will be returned.
  * In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The post request will compare the username to the users table for a match, and will bcrypt compare the password attempt to the hashed password in the user table. Returns user information (minus password) on success. A user session is created upon success.

    {
      "user": {
        "username": "Mel",
        "user_id": 7,
        "shotsRemaining": 2,
        "created_at": "2016-12-08 06:18:15"
      }
      ["entries" [{}] ]
    }


### Get all entries (i.e., photos) (AU)

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET    | `/v1/entries/:user_id` | Retrieve all One Shot entries | entries |

#### Response
##### Status Codes:
* On success, the HTTP status code in the response header is 200 ('OK').
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The get request will return an object with the key "entries" containing an array of entry objects, and the key "myFlukes" containing an array of entry IDs (ints).

    {
      "entries":
        [
          {
            "entry_id": 1,
            "created_at": [date/time],
            "user_id": 2
          },
          {
            "entry_id": 2,
            "created_at": [date/time],
            "user_id": 4
          }
        ],
       "myFlukes": [1, 5, 9, 12]
    }

If a non-authenticated user attempts this, the result will be:

     {
     "data": "Invalid Permissions"
     }

### Add new entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries/new` | Post new One-Shot entry | entry_id |

The submission should take the format:

    {
      "user_id": 4,
      "image_url": "path/to/image.jpeg"
    }

#### Response
##### Status Codes:
* On success, the HTTP status code in the response header is 201 ('Created').
* If information format given is non-valid, an HTTP status code of 400 ('Bad Request') will be returned.
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The post request will return an object with the id of the entry just submitted. The user who submits the image will have their shots remaining decremented by one.

    {
      "entry_id": 12
    }

### Get all entries by a specific user (AU)

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET    | `/v1/entries/user/:user_id` | Retrieve all entries posted by a specific user | user_entries |

#### Response
##### Status Codes:
* On success, the HTTP status code in the response header is 200 ('OK').
* If a non-valid user ID is given, an HTTP status code of 400 ('Bad Request') will be returned.
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The get request will return an object with the key "user_entries", containing an array of the entry objects.

    {
      "user_entries":
        [
          {
            "entry_id": 1,
            "created_at": [date/time],
            "user_id": 5
          },
          {
            "entry_id": 3,
            "created_at": [date/time],
            "user_id": 5
          }
        ]
    }

If a non-authenticated user attempts this, the result will be:

     {
     "data": "Invalid Permissions"
     }

### Fluke/unfluke (like/unlike) an entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries/fluke` | Increment/decrement number of flukes | object with fluke data |

This post request first checks if the entry has already been fluked by the current user: if so, the image is unfluked. If not, the image is fluked.
The submission is an object containing the entry id & user id, e.g.:

    {
      entry_id: 1, user_id: 1
    }

#### Response
##### Status Codes:
* If the image is fluked, the HTTP status code in the response header is 201 ('Created').
* If the image is unfluked, the HTTP status code in the response header is 200 ('OK').
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The server will return an object structured as following

    {
      "action": "fluke"/"unfluke",
      "entry_id": 2,
      "success": true,
      "user_id": 3
    }


### Add a new comment to an entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries/comments/new` | Add a comment to an entry| comment_id |

This post creates a new comment in the comments table, associating the user who posted it to the entry it was posted on. It will also increment the commentCount column of the entries table for the given entry.
The submission is an object containing the entry id & user id and the comment string to be posted e.g.:

    {
      entry_id: 1,
      user_id: 1,
      comment: "Mel-lo I am Hel"
    }

#### Response
##### Status Codes:
* If the comment is posted, the HTTP status code in the response header is 201 ('Created').
* If the object provided is incorrectly formatted, the HTTP status code in the response header is 400 ('Bad Request').
* If the user is not authenticated (requires login), the HTTP status code in the response header is 401 ("Unauthorized")
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The server will return an object structured as following

    {
      "comment_id: 4
    }


### Edit entry

* Stretch goal - tba
