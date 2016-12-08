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
|GET|`/v1/users`|Get list of all users|users|

#### Response

###### Status Codes:
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

#### Response
###### Status Codes:

  * On success, the HTTP status code in the response header is 201 ('Created').
  * If the data passed in is incorrect, a 400 'Bad Response' HTTP status code will be returned.
  * In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The post request will add a new user row to the user table based on the form inputs. It will reject the request if the username is already taken, and return a falsey. If the user creation is successful, a truthy value will be returned.

    {"data": true}

### Login as user

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/users/login` | Authenticate a user | user |

#### Response

###### Status Codes:
  * On success, the HTTP status code in the response header is 200 ('OK').
  * If the login information is invalid (username doesn't exist / password is incorrect), a 401 'Unauthorized' HTTP status code will be returned.
  * If the data passed in is incorrect, a 400 'Bad Response' HTTP status code will be returned.
  * In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The post request will compare the username to the users table for a match, and will bcrypt compare the password attempt to the hashed password in the user table. Returns user information (minus password) on success. [Creates user session]

    {
      "user": {
        "username": "Mel",
        "user_id": 7,
        "shotsRemaining": 2
      }
      ["entries" [{}] ]
    }
