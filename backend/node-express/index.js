/*********************************************************************
 |
 | This file is the entry point for the application.
 | Set up all of the application dependencies first.
 |
 *********************************************************************/
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
// Set up in-memory session support
var session = require('express-session');
// Prepare a MongoDB client
var MongoConnection = require('./lib/db'), database;


/*********************************************************************
 |
 | Next, create an instance of the Express server and configure
 | any middleware that we want to use with it.
 |
 *********************************************************************/
// Instantiate an instance of Express
var app = express();

// Enable JSON (Ajax) and url-encoded body parsing so that
// we can access POST data as `req.body` in route handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set up session (will be available in every request as `req.session`)
app.use(session({
  secret: 'groopy!',
  resave: true,
  saveUninitialized: true
}));

// Configure Express to render EJS templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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


/*********************************************************************
 |
 | Set up our database and connect to it
 |
 *********************************************************************/
// Use environment variables for the configuration if available
config.mongo.username = process.env.mongouser || config.mongo.username || '';
config.mongo.password = process.env.mongopass || config.mongo.password || '';
config.mongo.host = process.env.mongoserver || config.mongo.host || '';
config.mongo.port = process.env.mongoport || config.mongo.port || 33178;
config.mongo.database = process.env.mongodb || config.mongo.database || 'groops';

// Establish a connection to the Mongo database
database = new MongoConnection(config.mongo);
database.connect(function(){

  // Create a reference to the database available to the express app
  app.db = database;
  console.log(('Database:    '+(database.server+':'+database.port+'/'+database.database).bold).cyan);

  // Set up http server and websockets
  var http = require('http').Server(app);
  app.io = require('socket.io')(http);

  // This is our websockets API module:
  require('./lib/ws.js')(app);


/*********************************************************************
 |
 | Final step -- launch the web server
 |
 *********************************************************************/
  var server = http.listen(process.env.PORT||8000,function(){
    console.log('HTTP Server: '.green+('http://'+ip.address()+':'+server.address().port.toString()).bold.green+' in '.green+app.get('env').bold.yellow+' mode.'.green);
  });
});
