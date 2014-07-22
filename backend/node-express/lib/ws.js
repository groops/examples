var gravatar = require('gravatar');

module.exports = function(app){

  app.rooms = {};
  app.users = {};

  app.io.on('connection',function(socket){

    // Handle Disconnect
    socket.on('disconnect',function(){
      console.log(('Client '+socket.userid+' disconnected.').bold.red);
      var rm = app.rooms[app.users[socket.userid]];

      if (rm) {
        // Remove user from the session
        delete app.rooms[app.users[socket.userid]][socket.userid];
        delete app.users[socket.userid];

        // Alert users of the room that someone has left the room
        Object.keys(rm).forEach(function(room){
          rm[room].emit('user',{
            action: 'leave',
            user: socket.userid
          });
        });
      }
    });

    // When the client sends their user ID, bind it to the socket
    socket.on('join',function(data){

      app.rooms[data.room] = app.rooms[data.room] || {};

      socket.userid = data.user;
      socket.roomid = data.room;

      // If the user ID is already associated with a session, overwrite it to prevent conflict.
      app.rooms[data.room].hasOwnProperty(data.user) && delete app.rooms[data.room][data.user];

      // Get the new user details
      app.db.users.find({_id:app.db.ObjectID(data.user)}).toArray(function(err,doc){
        var usr = doc[0];
        usr.id = usr._id;
        delete usr._id;

        // Add the profile pic
        usr.profilepic = gravatar.url(usr.email);

        // Notify everyone in the room that the new user joined.
        Object.keys(app.rooms[data.room]).forEach(function(user){
          app.rooms[data.room][user].emit('user',{
            action: 'join',
            user: usr
          });
        });

        // Associate the user ID with the socket
        app.rooms[data.room][data.user] = socket;
        app.users[data.user] = data.room;

        console.log('User '+data.user+' joined the '+data.room+' room.');
      });

    });

    console.log('New client connected as '+socket.id);
  });
};
