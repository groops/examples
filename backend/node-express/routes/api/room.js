module.exports = function(app){

  // Helper
  var isDev = app.get('env') === 'development';

  // Room CRUD
  app.get('/api/rooms', function(req, res) {
    app.db.rooms.find({}).toArray(function(err,rms){
      // If there is an error, send a 500 and error message.
      if (err) { return res.send(500,{error:err.message}); }

      res.send(rms.map(function(el){
        return {
          id: el._id,
          name: el.name,
          messages: el.messages.length || 0,
          users: el.users.length || 0
        }
      }));
    });
  });


  // Get messages for a specific room
  app.get('/api/room/:id/messages', function(req,res){
    var msg = app.db.rooms.find({_id:app.db.ObjectID(req.params.id)},{messages:1});
    console.log(msg);
    res.send(msg.map(function(el){
      el.id = el._id;
      delete el._id;
    }));
  });


  // Get a specific room
  app.get('/api/room/:id', function(req, res) {
    app.db.rooms.findOne({_id: app.db.ObjectID(req.params.id) },function(err,doc){
      // If there is an error, send a 500 and error message.
      if (err) { return res.send(500,{error:err.message}); }

      // Cleanup
      doc.id = doc._id;
      delete doc._id;

      res.send(doc);
    })
  });


  // Create a room
  app.post('/api/room', function(req, res) {
    // Make the room data
    var data = {
      name: req.body.name,
      messages: [],
      users: []
    };

    // Save the data to Mongo and send the room ID as a result.
    app.db.rooms.save(data,function(err,doc){
      // If there is an error, send a 500 and error message.
      if (err) { return res.send(500,{error:err.message}); }

      // If the new room is created successfully, send a 201 and the new room ID
      isDev && console.log('Created room: \n'+JSON.stringify(data,null,2)+'\nID: '+doc._id);
      res.send(201,{id: doc._id});
    });
  });


  // Update room name
  app.put('/api/room/:id', function(req, res) {
    // Save the data to Mongo and send the user ID as a result.
    app.db.users.update({_id:app.db.ObjectID(req.params.id)},{$set: {name:req.body.name}},{},function(err,doc){
      console.log(arguments);
      // If there is an error, send a 500 and error message.
      if (err) { return res.send(500,{error:err.message}); }

      // If nothing was updated, send an error.
      if (doc === null || doc === 0){
        return res.send(500,{error:'Error updating room name.'});
      }

      // If the new user is created successfully, send a 201 and the new user ID
      isDev && console.log('Updated room: '+doc._id);
      res.send(200);
    });
  });


  // Remove room
  app.delete('/api/room/:id', function(req, res) {
    app.db.rooms.remove({_id:app.db.ObjectID(req.params.id)},function(err,result){
      if (err){
        return res.send(500,'Could not remove room '+req.params.id);
      }
      isDev && console.log('Removed room '+req.params.id);
      res.send(200);
    });
  });

}
