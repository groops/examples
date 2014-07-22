module.exports = function(app){

  app.users = {};

  app.io.on('connection',function(socket){

    // Handle Disconnect
    socket.on('disconnect',function(){
      console.log(('Client disconnected.').red);
    });

    // When a client connects, request their data
    socket.emit('requestuserid');

    // When the client sends their user ID, bind it to the socket
    socket.on('userid',function(id){
      socket.userid = id;

      // If the user ID is already associated with a session, overwrite it to prevent conflict.
      app.users.hasOwnProperty(id) && delete app.users[id];

      // Associate the user ID with the socket
      Object.defineProperty(app.users,id,{
        enumerable: true,
        get: function(){
          return socket;
        }
      });
    });

    console.log('New client connected as '+socket.id);
  });
};
