# API Documentation

#### Authors

* Harrison Symes
* Katherine Nagels
* Mel Booth
* Ursula Frickey

## Summary

API for use with the Flooki (formerly "One-Shot") app project.


##### The API can:
| Task | Method | Requires authentication? |
| ------ | -------- | -------- |
| [Return a list of all users](#return-list-of-all-users) | GET | yes |
| [Create a new user](#create-new-user) | POST | no |
| [Log in as a user](#login-as-user) | POST | yes |
| [Return a list of all photo entries](#get-all-entries) | GET | yes |
| [Add a new photo entry](#add-new-entry) | POST | yes |
| [Return all photo entries by a specific user](#get-all-entries-by-a-specific-user) | GET | yes |
| [Fluke/unfluke (like or dislike) a specific post](#fluke-or-unfluke-an-entry) | POST | yes |
| [Add a new comment to an entry](#add-a-new-comment-to-an-entry) | POST | yes |
| [Get all comments on a specified entry](#get-all-comments-on-a-specified-entry) | GET | yes |
| [User A follows/unfollows User B](#User-A-follows-or-unfollows-user-B) | POST | yes |
| [Get users a user is following](#get-users-a-user-is-following) | GET | yes |
| [Get all entries of a user's followed users](#get-all-entries-of-a-users-followed-users) | GET | yes |

If a non-authenticated user attempts any auth requiring requests, the result will be an object structured as follows:

    {
      "error":
      {
        "type": "auth",
        "code": 401,
        "message": "authentication failed"
      }
    }

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

([back to summary](#summary))  

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

([back to summary](#summary))  

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
        "user_created_at": "2016-12-08 06:18:15"
      }
    }

([back to summary](#summary))  

### Get all entries

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET    | `/v1/entries/:user_id` | Retrieve all entries | entries |

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
            "entry_created_at": [date/time],
            "user_id": 2,
            "comment_count": 0
          },
          {
            "entry_id": 2,
            "entry_created_at": [date/time],
            "user_id": 4,
            "comment_count": 4
          }
        ],
       "myFlukes": [1, 5, 9, 12]
    }

([back to summary](#summary))  

### Add new entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries/new` | Post new entry | entry_id |

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

([back to summary](#summary))  

### Get all entries by a specific user

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
            "entry_created_at": [date/time],
            "user_id": 5,
            "comment_count": 0,
          },
          {
            "entry_id": 3,
            "entry_created_at": [date/time],
            "user_id": 5,
            "comment_count": 4,
          }
        ]
    }





([back to summary](#summary))  

### Fluke or unfluke an entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries/fluke` | Increment/decrement number of flukes (likes) | object with fluke data |

This post request first checks if the entry has already been fluked (liked) by the current user: if so, the image is unfluked (unliked). If not, the image is fluked (liked).
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

([back to summary](#summary))  

### Add a new comment to an entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST    | `/v1/entries/comments/new` | Add a comment to an entry| comment_id |

This post creates a new comment in the comments table, associating the user who posted it to the entry it was posted on. It will also increment the commentCount column of the entries table for the given entry.
The submission is an object containing the entry id & user id and the comment string to be posted e.g.:

    {
      "entry_id": 1,
      "user_id": 1,
      "comment": "Mel-lo I am Hel"
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

([back to summary](#summary))  

### Get all comments on a specified entry

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET   | `/v1/entries/comments/:entry_id` | get all comments on an entry| entry_comments |

This get will return an array of the comment objects associated to the specified entry. The comments will be arranged in a descending order, meaning the first index will be the latest comment.
The :entry_id parameter in the request url is the id of the entry you wish to retrieve the comments of

#### Response
##### Status Codes:
* If the entry exists and the comments are retrieved, the HTTP status code is 200 ('Created').
* If the entry_id given does not match any entries in the database, the HTTP status code in the response header is 400 ('Bad Request').
* If the user is not authenticated (requires login), the HTTP status code in the response header is 401 ("Unauthorized")
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The server will return an object structured as following

    {
      "entry_comments": [
        {
          "comment": "Mel-lo I am Hel",
          "comment_created_at": 2016-12-12 04:48:20,
          "username": "mel"
        },
        {
          "comment": "I do like this meme, it is a nice meme",
          "comment_created_at": 1969-20-04 04:20:00,
          "username": symeshjb
        }
      ]
    }

([back to summary](#summary))

### User A follows or unfollows user B

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| POST   | `/v1/entries/follows/new` | toggles user A following user B | "success" |

If there is an existing follow relationship between user A and user B (A following B), the row in the follows table describing this relationship will be deleted and a "success" string will be returned.
If there is not an existing relationship from user A to B, a row in the follows table will be created to describe this follow relationship and a "success" string will be returned.

The followed user's "follow_count" column of the users table will be incremented by 1 if a follow row is created, or decremented by 1 if the row is deleted.
The posted object should take the form:

    {
      following_user_id: 4, /*(user A)*/
      followed_user_id: 2 /*(user B)*/
    }


#### Response
##### Status Codes:
* If the follow event is created/deleted, the HTTP status code is 201 ('Created').
* If the users given do not both match users in the database, or if the information posted has the wrong format, the HTTP status code in the response header is 400 ('Bad Request').
* If the user is not authenticated (requires login), the HTTP status code in the response header is 401 ("Unauthorized")
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The server will return a text string as following

        res.body = "success"

([back to summary](#summary))


### Get all entries of a user's followed users

| Method | Endpoint | Usage | Returns |
| ------ | -------- | ----- | ------- |
| GET    | `/v1/entries/follows/:user_id` | Retrieve all entries a user is following | followed_entries |

#### Response
##### Status Codes:
* On success, the HTTP status code in the response header is 200 ('OK').
* If a non-valid user ID is given, an HTTP status code of 400 ('Bad Request') will be returned.
* In case of server error, the header status code is a 5xx error code and the response body contains an error object.

The get request will return an object with the key "followed_entries", containing an array of the entry objects with the key "followed_entries" and an array of the user_ids of the users being followed, with the key "following_list".

     {
       "followed_entries":
         [
           {
             "entry_id": 1,
             "entry_created_at": [date/time],
             "image_url": "memes.com/pepe"
             "user_id": 5,
             "comment_count": 0,
             "username": "kfrn"
           },
           {
             "entry_id": 3,
             "entry_created_at": [date/time],
             "image_url": "memes.com/doge"
             "user_id": 5,
             "comment_count": 4,
             "username": "symeshjb"
           }
         ],
      "following_list": [1, 4, 7]
     }

([back to summary](#summary))  
