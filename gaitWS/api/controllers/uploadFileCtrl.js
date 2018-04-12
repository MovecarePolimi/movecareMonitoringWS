'use strict';

var util = require('util');

var fs = require('fs');
var formidable = require('formidable');
var delayedStream = require('delayed-stream');


module.exports = {
  uploadFile: uploadGaitFile
};



function uploadGaitFile (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    console.log(" --> UploadGaitFile : START");
    var delayed = delayedStream.create(req);
    delayed.pause();

    var form = new formidable.IncomingForm();
    console.log(' --> Formidable initialized');
    if(form == null){
        console.log(' --> Formidable is NULL');
    } else{
        console.log(' --> Not NULL');
    }
    delayed.resume();
    form.parse(delayed.source);
    /*form.parse(req, function (err, fields, files) {
      res.json({success:true});
    });*/

    /*form.once('error', console.log)
    form.parse(req, function (err, fields, files) {})*/
    /*form.parse(req, function (err, fields, files) {
      res.json(true);
    });
*/

}

/*
if (err){
            console.log("---> ERROR <--- !");
            res.json({
                success:false,
                error: err.message
            });
        }
        else{
            console.log("CALL stored");
            res.json({success:true});
        }
        */

