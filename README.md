# Wefox code-chalenge

## Mongodb data model

| Location       |              | description                                         |
| -------------- | ------------ | --------------------------------------------------- |
| _address_      | Object       | { street, streetNumber, town, postalCode, country } |
| _coords_       | Object       | { lat, lng }                                        |
| _notification_ | Object       | { causes: [], schedules: [] }                       |
| _forecast_     | Object       | the Json Object returned by ForecastServices        |
| _queriedBy_    | String       | user Email                                          |
| _timestamp_    | Date (ticks) |

Remember to:

- execute the script **npm run prefill-redis.js** once the express server is up and running

### The app container

In it runs the Express server and the batch service.
Express server enpoints are implemented here with some mechanism to handle input validation (@hapi/joi) and middlewares to ease async operations and error handling.

### The oAuth system

The scope "email basic_user_info" must be specified when the oAuth token is requested to tell the Redis oAuth server to add those info to the token.

The user email will be used:
  - in the batch process to send the notification to the user
  - to allow a user to set the notification options

#### Endpoints (curl request examples):

**POST requsest to get the oAuth token**

- curl --location --request POST 'http://localhost:3000/auth/oauth/token' \
  --header 'Authorization: Basic <*base64 ClientId:ClientSecret*>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=<*username*>' \
  --data-urlencode 'password=<*password*>' \
  --data-urlencode 'scope=email basic_user_info'

**GET requsest to retrieve the forecast data associated to a valid address**

- curl --location --request GET 'http://localhost:3000/auth/weather?street=calle%20marina&streetNumber=187&town=Barcelona&postalCode=08013&country=Spain' \
  --header 'Authorization: Bearer <*oAuth token*>'

**POST requsest to set the notification options**

- curl --location --request POST 'http://localhost:3000/auth/notification-options' \
  --header 'Authorization: Bearer <*oAuth token*>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'causes=Rain' \
  --data-urlencode 'causes=Snow' \
  --data-urlencode 'schedules=10:30;15:30'

# Environment variables

You have to specify the following _environment_ variables:

# Express

- LISTENING_PORT = 3000
- BATCH_POLLING_INTERVAL = 360000

# MongoDB

- MONGO_URL = <mongo db coonnection string>
- MONGO_INITDB_ROOT_USERNAME = <*root username*>
- MONGO_INITDB_ROOT_PASSWORD = <*root password*>
- MONGO_INITDB_DATABASE = <*database name*>
- MONGO_INITDB_USERNAME = <*username*>
- MONGO_INITDB_PASSWORD = <*password*>
- MONGO_REPLICA_SET_NAME = rs0

# Google services

- GOOGLE_MAPS_API_KEY = <*google API key*>

# Open weather services

- OPEN_WEATHER_API_KEY= <*open weather API key*>

# Redis

- REDIS_URL = redis://redis
- REDIS_CACHE_EXPIRATION_PERIOD = 43200

# Oauth2

- ACCESS_TOKEN_LIFETIME=36000
- CLIENT_ID = <*client ID*>
- CLIENT_SECRET = <*client secret*>

### Installation

```sh
$ docker-compose up
```

### Tests

There are both unit and integration tests provided for this project:

- testing framework: **Jest**

```sh
$ npm run test
$ npm run test:int
```

# TO-DO

- more test coverage
- provide swagger (OpenAPI) endpoint definitions
- implementing the MailService
