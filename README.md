# Introduction

Your revolutionary My Barista app is getting a lot of traction and users are demanding a new
feature: coffee recommendations. You decided to implement it as a backend service serving HTTP/JSON
API, using your last fancy "hello world" NestJS app for starters. There is no need to worry about
persistent database at this point – startup world is full of risk and you are ready to embrace it by
relying on in-memory storage only. To bring any value to your wonderful users you need to provide
endpoints to rate coffee brewed today, list previous ratings and previously rated coffee types, and,
last but not least, receive recommendation of coffee type to brew today.

## App requirements

Your app have to satisfy requirements of 4 HTTP requests described below:

### Endpoint to rate coffee type

- request: `POST /ratings`
- request body: JSON in form of object
  `{ "coffeeType": "coffee type to rate", "starRating": "3/5" }`
- HTTP status for success: `201 Created`
- HTTP status for validation error: `400 Bad Request`
- validation of `coffeeType` property:
  - it has to be present in the request body
- validation of `starRating` property:
  - it has to be present in the request body
  - it has to satisfy format of `"1/5"` where first integer is a number of stars given, min 1, max
    5, and second integer is the max stars allowed (always `5`). There cannot be any extra
    whitespaces or other number formats. E.g. `"5/5"` is correct and `"5.0 / 5.0"` is not.

### Endpoint to list rated coffee types

- request: `GET /ratings/coffee-types`
- HTTP status for success: `200 OK`
- response body: JSON in form of array `[ "some rated coffee type", "another rathed coffee type" ]`
- business logic:
  - all coffee types rated with `POST /ratings` should be included in response body
  - resulting array should be empty (`[]`) in case no coffee type was rated yet
  - resulting array should contain no duplicates

### Endpoint to obtain rating of previously rated coffee type

- request: `GET /ratings`
- request URL query param: `coffeeType`
- response body: JSON in form of object
  `{ "coffeeType": "previously rated coffee type", "starRating": "3/5" }`
- HTTP status for success: `200 OK`
- HTTP status for validation error: `400 Bad Request`
- HTTP status when asking for rating of coffee type that was not rated yet: `400 Bad Request`
- validation of `coffeeType` query param:
  - it has to be present in the URL
- business logic:
  - rating given thanks to `POST /ratings` can be obtained with `GET /ratings`
  - returned rating should be the most recent one from multiple ratings of same coffee type
  - error response should be returned when asking for rating of coffee type that was not rated yet
    and its response body should be JSON object in form of
    `{ "coffeeType", "not rated yet coffee type taken from query param" }`

### Endpoint to recommend a coffee type for today

- request: `GET /recommendation`
- response body for success: JSON in form of object `{ "coffeeType": "recommended coffee type" }`
  - HTTP status for success: `200 OK`
- response body for empty result: JSON in form of object `{ "message": "NO_RECOMMENDATIONS_AVAILABLE" }`
  - HTTP status for empty result: `200 OK`
- business logic:
  - recommended coffee type is calculated based on most recent ratings only (e.g. if `coffee A` was
    rated first, next `coffee B`, and then `coffee A` again, in result `coffee B` is considered as
    older rating than `coffee A`)
  - most recently rated coffee type is not included in recommendation calculation (eg. if most
    recent ratings order is `coffee A` –> `coffee B` –> `coffee C`, then recommended coffee type is
    chosen from `coffee A` and `coffee B`)
  - then only coffee types rated with 4 stars or more (`"4/5"` and `"5/5"`) are considered good
    enough to be recommended
  - then the one of them rated oldest is recommended
  - and if there is no such coffee type, response body with `message` of value `NO_RECOMMENDATIONS_AVAILABLE` is returned

## Setup

This app was originally created with Node.js 10.14.1 / npm 6.4.1. You can use
[nvm](https://github.com/creationix/nvm) to make sure you work with the same version of Node.js –
run `nvm install` and nvm will set up Node.js based on `.nvmrc` file.

Follow these steps to set up the app:

1. `npm install` – install dependencies
2. `npm test` – run all tests (should fail unless you implement the task)
3. `npm start` – serve the app at [http://localhost:3000/](http://localhost:3000/) (you can check if
   it works by opening [http://localhost:3000/greeting](http://localhost:3000/greeting) in your
   browser or executing `curl http://localhost:3000/greeting` in your terminal – `Hello, world!`
   should be printed)

There is also the `npm run test:watch` command available to start test runner in the watch mode. It
runs tests related to modified files only.

Note that strict mode is turned on for TypeScript compiler in this task (see `--strict` option on
[https://www.typescriptlang.org/docs/handbook/compiler-options.html#compiler-options](https://www.typescriptlang.org/docs/handbook/compiler-options.html#compiler-options)).
