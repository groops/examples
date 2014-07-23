var request = require('request'),
    _ = require('underscore'),
    util = require('./util');

module.exports = function(app){

  return {

    get: function (req, res) {
      if (!req.session.user) {
        return res.redirect('/main');
      }
      if (req.params.id) {
        var path = util.apiPath(req, 'room/' + req.params.id);

        request.get(path, function(err, response, data) {
          if (err || response.statusCode === 500) {
            console.log('error getting room ' + req.params.id + ': ' + err || response.error);
            return res.redirect('/main');
          }
          if (response.statusCode === 404) {
            // Room id was not found, return to main view
            console.log('room not found: ' + req.params.id);
            return res.redirect('/main');
          }
          var room = JSON.parse(data);

          request.get(path + '/messages', function(err, response, messages) {
            if (err || response.statusCode === 500) {
              console.log('error getting messages: ' + err || response.error);
              return res.send(500, err);
            }
            res.render('room', {
              title: 'Groop: ' + room.name,
              user_id: req.session.user.id,
              room_id: room.id,
              name: room.name,
              messages: JSON.parse(messages)
            });
          });
        });
      }
      else {
        // No room id was passed, so just return to the main view
        res.redirect('/main');
      }
    },

    create: function(req, res) {
      var path = util.apiPath(req, 'room');

      request.post(path, {
        form: {
          name: req.body.room_name
        }
      },
      function (err, response, data) {
        if (err || response.statusCode === 500) {
          console.log('error creating room: ' + err || response.error);
          return res.send(500, err);
        }
        data = JSON.parse(data);
        req.session.user.room = data.id;

        res.redirect('/room/' + data.id);
      });
    }
  };
};
