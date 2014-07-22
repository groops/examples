var gravatar = require('gravatar'),
    request = require('request');

module.exports = function(app){

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

  // Handle intro page form submission
  app.post('/register', function(req, res) {
    var userInfo = req.body;

    // console.log(userInfo);

    request.post('http://localhost:8000/api/user', {
      form: userInfo
    },
    function (err, response, data) {
      if (err) {
        console.log('error: ' + err);
        return res.send(500, err);
      }
      req.session.user = userInfo;
      req.session.user.id = data.id;
      req.session.user.gravatarUrl = gravatar.url('brian@moeskau.com', {s: '100'});

      res.redirect('/main');
    })
  });
};
