module.exports = function(app) {

var api = require('./api/index')(app),
  index = require('./controllers/index')(app),
  user = require('./controllers/user')(app),
  room = require('./controllers/room')(app);

  /*************************************
   * Web app controllers
   *************************************/
  // Navigation
  app.get('/', index.register);
  app.get('/main', index.main);
  app.get('/room/:id', room.get);

  // Handle entry page form submission
  app.post('/register', user.register);

  // Handle room creation request
  app.post('/room', room.create);


  /*************************************
   * API methods
   *************************************/
  // Users
  app.get('/api/user/:id', api.user.get);
  app.post('/api/user', api.user.create);
  app.put('/api/user/:id', api.user.update);
  app.delete('/api/user/:id', api.user.remove);

  // Rooms
  app.get('/api/rooms', api.room.all);
  app.get('/api/room/:id', api.room.get);
  app.post('/api/room', api.room.create);
  app.put('/api/room/:id', api.room.update);
  app.delete('/api/room/:id', api.room.remove);

  // Messages
  app.get('/api/room/:id/messages', api.message.allForRoom);
  app.get('/api/message/:id', api.message.get);
  app.post('/api/room/:id/message', api.message.create);
  app.delete('/api/message/:id', api.message.remove);

};
