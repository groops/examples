var request = require('request'),
    _ = require('underscore'),
    util = require('./util');

module.exports = function(app) {

  return {

    register: function(req, res) {
      res.render('intro', {
        title: 'Groops'
      });
    },

    main: function(req, res) {
      if (req.session.user) {
        var path = util.apiPath(req, 'rooms');

        request.get(path, function(err, response, data) {
          if (err || response.statusCode === 500) {
            console.log('error getting rooms: ' + err || response.error);
            return res.send(500, err);
          }
          var rooms = _.sortBy(JSON.parse(data), function(room) {
            // Returns rooms sorted by the number of users (descending)
            return -room.users;
          });

          res.render('main', {
            title: 'Groops List',
            user: req.session.user,
            rooms: rooms
          });
        });
      }
      else {
        res.redirect('/');
      }
    }
  }
};
