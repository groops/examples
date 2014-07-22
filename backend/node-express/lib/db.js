// Create the MongoDB client
var mongoclient = require('mongodb').MongoClient,
    util = require('./utilities');

// Make sure all the appropriate environment variables are available.
if (!util.process.hasAll('mongouser','mongopass','mongoserver','mongoport','mongodb')){
  console.log('Invalid or incomplete MongoDB configuration.');
  process.exit(1);
}

/**
 * The DB class is a wrapper around the MongoDB store.
 */
var Class = function(){
  var me = this;

  // Basic Mongo configuration
  this.username = process.env.mongouser;
  this.server = process.env.mongoserver;
  this.port = process.env.mongoport;
  this.database = process.env.mongodb;
  this.raw = null;

  // This is a helper method for generating MongoDB ID's.
  // See http://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html
  this.ObjectID = require('mongodb').ObjectID;

  this.connect = function(callback) {
    mongoclient.connect('mongodb://'+this.username+':'+process.env.mongopass+'@'+this.server+':'+this.port.toString()+'/'+this.database, { auto_reconnect: true }, function(err, db){

      if(err) throw err;

      me.emit('connected');

      // Access or create a collection.
      me.raw = db; // Reference to the raw DB
      me.users = db.collection('users'); // Reference to the users collection
      me.rooms = db.collection('rooms'); // Reference to the rooms collection

      // Monitor the DB to assure the connection doesn't close (keepalive)
      setInterval(function(){
        me.users.find({login:''});
      },9000);

      // Emit a ready event
      me.emit('ready');

      // Execute the callback if it is defined
      callback && callback();
    });
  };

};

// Inherit event emitting capabilities from the core events module (native to node.js)
var EE = require('events').EventEmitter;
require('util').inherits(Class,EE);

module.exports = Class;
