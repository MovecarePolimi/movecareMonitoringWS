'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.
  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var User = require('../../../db/models/user');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.
 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.
 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document
  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  allusers: allusers,
  userprofile: userprofile
};

function allusers(req, res) {
  var arr = [];
    User.find({}, function(err, users) {
      if(err) res.json(err.message);
        for (var i = 0; i < users.length; i++) {
          arr[i] = {
            username: users[i].username,
            email: users[i].email
          }
        }
        res.json(arr);
    });
}

function userprofile(req, res) {
    var profile = {};

    var username = req.swagger.params.username.value;

    User.find({username: username}, function(err, user) {
        if(err) res.json(err.message);
        res.json(user);
    });
}
