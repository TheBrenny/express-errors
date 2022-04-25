# Express Errors
> *Simple, low-code, error reporting for your Express Project.*

This repo lets you respond with HTTP Status Codes out of the box! You just `throw error.404.fromReq(req)` and let the router do the rest!

## Install

This repo is intended to be installed as a **submodule** in your code. This is a design choice because you can pull this repo and modify it directly to suit your needs. You can even fork this repo for yourself and make your own changes, and maintain it for your needs.

```console
$ cd app/routes/
$ git submodule add https://github.com/TheBrenny/express-errors
Cloning into 'express-errors'...
remote: Counting objects: 11, done.
remote: Compressing objects: 100% (10/10), done.
remote: Total 11 (delta 0), reused 11 (delta 0)
Unpacking objects: 100% (11/11), done.
Checking connectivity... done.
```

## Usage

```javascript
// ./app/routes/routes.js
const errors = require("./express-errors/routes"); // or invoke as a function and pass true/false to set whether this is production mode (default: true)

// ... all your actual routes

// These work as catch alls
router.use(errors.notFound);
router.use(errors.handler);
```

Okay, that's nice, but what can it do?

```javascript
// ./app/routes/routes.js
const errors = require("./express-errors/routes");

router.get("/cake", (req,res) => {
  throw errors.errors.notFound.fromReq(req);
});

// These work as catch alls
router.use(errors.notFound);
router.use(errors.handler);
```

Oh, that's cool, but how many errors does it have, and how many ways can they be represented?

```javascript
// express-errors/generic.js#L27-40
const errors = {
    400: badRequest,
    403: forbidden,
    404: notFound,
    409: conflict,
    500: internalServerError,
    501: notImplemented,
    badRequest,
    forbidden,
    notFound,
    conflict,
    internalServerError,
    notImplemented,
};

// All error objects are exposed as their name and their status code
```

> But wait, there's so many more than just those!

Correct. I haven't needed them though. The plan is to fill them out as they're required. A great resource is https://developer.mozilla.org/en-US/docs/Web/HTTP/Status.

## Contributing

If you've needed a particular status code, then push it up! Obviously, no need for redirections (`3xx`), successes (`2xx`), or informations (`1xx`), because they already show infomation to the user (hopefully), or you're handling them specifically.

## License

MIT