var gravatar = require('gravatar'),
    request = require('request');

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
      res.render('main', {
        title: 'Groops List',
        user: req.session.user,
        rooms: []
      });
    }
    else {
      res.redirect('/');
    }
  });

  app.get('/room/:id', function(req, res) {
    res.send(200, 'In room ' + req.params.id);
  });

  // Handle intro page form submission
  app.post('/register', function(req, res) {
    var userInfo = req.body;

    // console.log(userInfo);

    request.post(apiRoot + 'user', {
      form: userInfo
    },
    function (err, response, data) {
      if (err) {
        console.log('error: ' + err);
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
      if (err) {
        console.log('error: ' + err);
        return res.send(500, err);
      }
      data = JSON.parse(data);
      req.session.user.room = data.id;

      res.redirect('/room/' + data.id);
    });
  });

};
