var mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const nconf = require('nconf');

nconf.argv()
   .env({lowerCase:true, parseValues:true})
   .file({ file: 'config/default.json' });


dbHost = nconf.get('database:host');
dbUser = nconf.get('database:username');
dbPass = nconf.get('database:password');
dbName = nconf.get('database:dbname');

var db = {};

db.init = function(){
    var logger = require('npmlog');
    var connString = "mongodb://" + dbUser + ":" + dbPass + "@" + dbHost + "/" + dbName + "?authSource="+dbName;

    logger.log("info", "Connection: " + connString);
    mongoose.connect(connString, {
        useNewUrlParser: true
    });

    db.db = mongoose.connection;

    db.db.on('error', function(error){
        logger.log("error", error);
        throw (error);
    });
    db.db.once('open', function(){
        logger.log("debug", "Db connection established");
    });

    db.Permission = require('./model/permission');
    db.Conversation = require('./model/conversation');

};



module.exports = db;
