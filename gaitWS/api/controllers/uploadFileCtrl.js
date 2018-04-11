'use strict';

var util = require('util');

var fs = require('fs');

var commonFunctions = require("./commonFunctions");

module.exports = {
  uploadFile: uploadGaitFile
};

function uploadGaitFile (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    console.log(" --> UploadGaitFile : START");
    console.log(" --> Req URL : "+req.url);
    console.log(' --> Req Method: %s', req.method);



}

