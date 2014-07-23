var gravatar = require('gravatar'),
    request = require('request'),
    _ = require('underscore');

module.exports = function(app){

  var apiRoot = 'http://localhost:8000/api/';

  // Handle navigation to the index page
  app.get('/', function(req, res) {
    res.render('intro', {
      title: 'Groops'
    });
  });

  // Handle navigation to the main page
  app.get('/main', function(req, res) {
    if (req.session.user) {
      request.get(apiRoot + 'rooms', function(err, response, data) {
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
  });

  // Navigation to a specific room by id
  app.get('/room/:id', function(req, res) {
    if (!req.session.user) {
      return res.redirect('/main');
    }
    if (req.params.id) {
      request.get(apiRoot + 'room/' + req.params.id, function(err, response, data) {
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

        request.get(apiRoot + 'room/' + req.params.id + '/messages', function(err, response, messages) {
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
  });

  // Handle intro page form submission
  app.post('/register', function(req, res) {
    var userInfo = req.body;

    if (userInfo.twitter) {
      userInfo.twitter = userInfo.twitter.replace('@','');
    }

    request.post(apiRoot + 'user', {
      form: userInfo
    },
    function (err, response, data) {
      if (err || response.statusCode === 500) {
        console.log('error registering: ' + err || response.error);
        return res.send(500, err);
      }
      data = JSON.parse(data);
      req.session.user = userInfo;
      req.session.user.id = data.id;
      req.session.user.gravatarUrl = gravatar.url(userInfo.email, {s: '100'});

      res.redirect('/main');
    });
  });


  // Handle room creation request
  app.post('/create-room', function(req, res) {
    request.post(apiRoot + 'room', {
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
  });

};
