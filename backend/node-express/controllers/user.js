var request = require('request'),
  gravatar = require('gravatar')
  util = require('./util');

module.exports = function(app){

  return {

    register: function(req, res) {
      var userInfo = req.body,
        path = util.apiPath(req, 'user');

      if (userInfo.twitter) {
        userInfo.twitter = userInfo.twitter.replace('@','');
      }

      request.post(path, {
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
    }
  };
};
