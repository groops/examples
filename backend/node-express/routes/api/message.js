module.exports = function(app){

  // Helper
  var isDev = app.get('env') === 'development';

  // Get messages for a specific room
  app.get('/api/room/:id/messages', function(req,res){
    app.db.rooms.find({room:app.db.ObjectID(req.params.id)}).toArray(function(err,docs){
      res.send(docs.map(function(el){
        el.id = el._id;
        delete el._id;
      }));
    });
    isDev && console.log('Retrieved messages for room '+req.params.id);
  });

  // Get a specific message
  app.get('/api/message/:id', function(req,res){
    app.db.rooms.find({_id:app.db.ObjectID(req.params.id)}).toArray(function(err,docs){
      res.send(docs.map(function(el){
        el.id = el._id;
        delete el._id;
      })[0]);
    });
    isDev && console.log('Retrieved messages for message '+req.params.id);
  });

  // Create a message in a specific room
  app.post('/api/room/:id/message', function(req,res){
    var data = {
      content: req.body.message,
      room: app.db.ObjectID(req.params.id),
      created: new Date()
    };
    app.db.messages.save(data,function(err,doc){
      if (err) {return res.send(500,{error:err.message});}
      isDev && console.log('Created message '+doc._id);

      data.id = doc._id;
      delete data._id;

      // Let the room know a new message was created
      Object.keys(app.rooms[req.params.id]||{}).forEach(function(user){
        app.rooms[req.params.id][user].emit('message',{
          action: 'create',
          message: data
        });
      });

      res.send(201,{id: doc._id});
    });
  });

  // Remove a message
  app.delete('/api/message/:id', function(req,res){
    // Retrieve the room ID of the message to be removed
    var msg = app.db.messages.findOne({_id:app.db.ObjectID(req.params.id)},{room: 1});

    // Remove the message
    app.db.messages.remove({_id:app.db.ObjectID(req.params.id)},function(err,result){
      if (err){
        return res.send(500,'Could not remove message '+req.params.id);
      }
      isDev && console.log('Removed message '+req.params.id);

      // Alert all users in the room of the removed message
      Object.keys(app.rooms[req.params.id]||{}).forEach(function(user){
        app.rooms[msg.room.id][user].emit('message',{
          action: 'remove',
          message: req.params.id
        });
      });

      res.send(200);
    });
  });
}
