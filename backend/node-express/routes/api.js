/**
 * app.db is defined in ../index.js
 */
module.exports = function(app){

  // Include user routes
  require('./api/user')(app);

  // Include room routes
  require('./api/room')(app);

  // Include messages
  require('./api/message')(app);

};
