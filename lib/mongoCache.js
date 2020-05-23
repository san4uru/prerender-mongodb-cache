var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/prerender';

var database;

MongoClient.connect(mongoUri, function(err, db) {
    database = db;
});

var cache_manager = require('cache-manager');

var expirationTime = process.env.CACHE_EXPIRATION_DAYS || 7;

expirationTime = expirationTime *24*60*60*1000;

module.exports = {
    init: function() {
        this.cache = cache_manager.caching({
            store: mongo_cache
        });
    },

    requestReceived: function(req, res, next) {
        if(req.method !== 'GET') {
            return next();
        }

        this.cache.get(req.url, function (err, result) {
            if (!err && result) {
                req.prerender.cacheHit = true;
                res.send(200, result);
            } else {
                next();
            }
        });
    },

    beforeSend: function(req, res, next) {
        if (!req.prerender.cacheHit && req.prerender.statusCode == 200) {
            this.cache.set(req.url, req.prerender.content);
        }
        next();
    }
};


var mongo_cache = {
    get: function(key, callback) {
        database.collection('pages', function(err, collection) {
            collection.findOne({key: key}, function (err, item) {
                var now = new Date();
                var expirationDate = new Date(now.getTime() - expirationTime);
                var value = item && item.created > expirationDate ? item.value: null;
                callback(err, value);
            });
        });
    },
    set: function(key, value, callback) {
        database.collection('pages', function(err, collection) {
            var object = {key: key, value: value, created: new Date()};
            collection.update({key: key}, object, {
                    upsert: true
                }, function (err) {
            });
        });
    }
};
