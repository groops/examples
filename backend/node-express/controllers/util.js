var url = require('url');

module.exports = {

  apiPath: function(req, path) {
    var parts = url.parse(req.headers.referer),
      path = 'http://' + parts.host + '/api/' + path;

    // console.log('calling API: ' + path);
    return path;
  }

};
