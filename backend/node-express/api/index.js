/**
 * app.db is defined in ../index.js
 */
module.exports = function(app){

  return {

    // Include user routes
    user: require('./user')(app),

    // Include room routes
    room: require('./room')(app),

    // Include messages
    message: require('./message')(app)

  };
};
