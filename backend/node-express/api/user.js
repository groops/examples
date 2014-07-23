var gravatar = require('gravatar');

module.exports = function(app) {

  var isDev = app.get('env') === 'development';

  return {

    // Get a specific user
    get: function(req, res) {
      app.db.users.findOne({_id: app.db.ObjectID(req.params.id) },function(err,doc){
        // If there is an error, send a 500 and error message.
        if (err) { return res.send(500,{error:err.message}); }

        // Cleanup
        doc.id = doc._id;
        delete doc._id;

        doc.profilepic = gravatar.url(doc.email, {s: '100'});

        res.send(doc);
      });
    },

    // Create a user
    create: function(req, res) {
      // Make the user data
      var data = {
        name: req.body.name,
        email: req.body.email,
        twitter: req.body.twitter.replace('@','')
      };

      // Save the data to Mongo and send the user ID as a result.
      app.db.users.save(data,function(err,doc){
        // If there is an error, send a 500 and error message.
        if (err) { return res.send(500,{error:err.message}); }

        // If the new user is created successfully, send a 201 and the new user ID
        isDev && console.log('Created user: \n'+JSON.stringify(data,null,2)+'\nID: '+doc._id);
        res.send(201,{id: doc._id,profilepic:gravatar.url(req.body.email, {s: '100'})});
      });
    },

    // Update a specific user
    update: function(req, res) {
      // Make the user data
      var data = {
        name: req.body.name,
        email: req.body.email,
        twitter: req.body.twitter
      };

      // Save the data to Mongo and send the user ID as a result.
      app.db.users.update({_id:app.db.ObjectID(req.params.id)},data,function(err,doc){
        // If there is an error, send a 500 and error message.
        if (err) { return res.send(500,{error:err.message}); }

        // If the new user is created successfully, send a 201 and the new user ID
        isDev && console.log('Updated user: \n'+JSON.stringify(data,null,2)+'\nID: '+doc._id);
        res.send(200);
      });
    },

    // Delete a specific user
    remove: function(req, res) {
      app.db.users.remove({_id:app.db.ObjectID(req.params.id)},function(err,result){
        if (err){
          return res.send(500,'Could not remove user '+req.params.id);
        }
        isDev && console.log('Removed user: '+req.params.id);
        res.send(200);
      });
    }
  };
};
