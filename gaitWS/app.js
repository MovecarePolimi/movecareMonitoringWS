'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var serverConfig    = require('./config.js');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = serverConfig.port;
  app.listen(port);

});
