# API Documentation

#### Authors

* Harrison Symes
* Katherine Nagels

## Background

API for use with the "One-Shot" app project.
##### The API can:
  * authenticate, create and retrieve users from a user table.
  * get all photo entries
  * get photo entries by user
  * post to create a new entry
  * post to delete an entry

## Requests

### Return list of all users

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

The post request will add a new user row to the user table based on the form inputs. It will reject the request if the username is already taken, and return a falsey. If the user creation is successful, that user's ID will be returned.

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

The post request will compare the username to the users table for a match, and will bcrypt compare the password attempt to the hashed password in the user table. Returns user information (minus password) on success. [Creates user session]

    {
      "user": {
        "username": "Mel",
        "user_id": 7,
        "shotsRemaining": 2,
        "created_at": "2016-12-08 06:18:15"
      }
      ["entries" [{}] ]
    }

### Add new entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries` | Post new One-Shot entry | entry_id |

The submission should take the format:

    {
      "user_id": 4,
      "image_url": "path/to/image.jpeg"
    }

#### Response
##### Status Codes:
* On success, the HTTP status code in the response header is 200 ('OK').
* If information format given is non-valid, an HTTP status code of 400 ('Bad Request') will be returned.
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The post request will return an object with the id of the entry just submitted. The user who submits the image will have their shots remaining decremented by one.

    {
      "entry_id": 12
    }

### Get all entries (i.e., photos)

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET    | `/v1/entries` | Retrieve all One Shot entries | entries |

#### Response
##### Status Codes:
* On success, the HTTP status code in the response header is 200 ('OK').
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The get request will return an object with the key "entries" containing an array of entry objects.

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
        ]
    }

### Get all entries by a specific user

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET    | `/v1/entries/user` | Retrieve all entries posted by a specific user | user_entries |

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

### Edit entry

* Stretch goal - tba
