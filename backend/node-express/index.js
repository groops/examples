// Add some coloring to our console to make output more readable.
require('colors');
// Import the configuration
var config = require('./config.json');
// Express provides really basic HTTP services
var express = require('express');
// Express 4.x does not support cookie parsing by default, so it's added as another dependency.
var cookieParser = require('cookie-parser');
// Add support for processing request bodies (i.e. form POSTs, AJAX requests, etc)
var bodyParser = require('body-parser');
// Add a helper to pickup the local IP address (console logging purposes)
var ip = require('ip');
// The standard node.js path module is used multiple times, so it's easier to store it in a reference variable.
var path = require('path');
// Prepare a MongoDB client
var MongoConnection = require('./lib/db'), database;

// Instantiate an instance of Express
var app = express();

// Configure Express to render EJS templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add JSON body parsing (for use with the API/AJAX)
app.use(bodyParser.json());

// Support URL encoding
app.use(bodyParser.urlencoded());
app.use(bodyParser());

// Support cookies
app.use(cookieParser());

// Identify where static assets like raw HTML/CSS/JS/images/etc reside.
app.use(express.static(path.join(__dirname, 'public')));

// Identify whether the app will run in development or production mode. Defaults to production.
app.set('env',config.mode||process.env.ENV||'production');

// Include our custom routes for the API and template server
require('./routes/api')(app);
require('./routes/www')(app);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler will print a stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler. No stacktraces displayed to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Use environment variables for the configuration if available
config.mongo.username = process.env.mongouser || config.mongo.username || '';
config.mongo.password = process.env.mongopass || config.mongo.password || '';
config.mongo.host = process.env.mongoserver || config.mongo.host || '';
config.mongo.port = process.env.mongoport || config.mongo.port || 33178;
config.mongo.database = process.env.mongodb || config.mongo.database || 'groops';

// 1. Establish a connection to the Mongo database
database = new MongoConnection(config.mongo);
database.connect(function(){

  // Create a reference to the database available to the express app
  app.db = database;
  console.log(('Database:    '+(database.server+':'+database.port+'/'+database.database).bold).cyan);

  // 2. Setup websockets
  var http = require('http').Server(app);
  app.io = require('socket.io')(http);
  require('./lib/ws.js')(app);

  // 2. Launch the server
  var server = http.listen(process.env.PORT||8000,function(){
    console.log('HTTP Server: '.green+('http://'+ip.address()+':'+server.address().port.toString()).bold.green+' in '.green+app.get('env').bold.yellow+' mode.'.green);
  });
});
