prerender-mongodb-cache
=======================

Prerender plugin for MongoDB caching, to be used with the prerender node application from https://github.com/prerender/prerender.

How it works
------------

This plugin will store all prerendered pages into a MongoDB instance. 

How to use
----------

In your local prerender project run:

    $ npm i https://github.com/twoheaded/prerender-mongodb-cache.git --save

    
Then in the server.js that initializes the prerender:

    server.use(require('prerender-mongodb-cache'));

Configuration
-------------

By default it will connect to your MongoDB instance running on localhost and use the *prerender* collection. You can overwrite this by setting the `MONGOLAB_URI` or `MONGOHQ_URL` environment variables to valid MongoDB connection strings.

You can set cache expiration time in `CACHE_EXPIRATION_DAYS` environment variable (in days). By default - 7 days.

This is done to make it work automatically when deployed on Heroku with the MongoDB add-ons.
