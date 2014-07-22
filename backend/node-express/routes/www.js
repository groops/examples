var gravatar = require('gravatar'),
    bodyParser = require('body-parser');

module.exports = function(app){

  app.use(bodyParser());

  // Inde Page
  app.get('/', function(req, res) {
    res.render('intro', { title: 'Groops' });
  });

  // Intro Page
  app.post('/main', function(req, res) {
    console.log("BODY",req.body);
    res.render('main',{
      title: 'Available Groops',
      name: 'Person Name',
      email: 'me@domain.com',
      twitter: 'someone',
      profilepic: 'test',//gravatar()
      rooms: []
    });
  });

};
