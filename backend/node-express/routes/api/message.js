module.exports = function(app){

  app.post('/api/room/:id/message', function(req, res) {
    res.send(501);
  });

};
