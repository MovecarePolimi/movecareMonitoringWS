var mongoose = require('mongoose');
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;
var valFunction = require("../validationFunction.js");

var currentDatabase = dbconfig.measurements;
var currentCollection = dbconfig.SUC;    // calls

mongoose.Promise = global.Promise;

console.log("************ CALL --> "+dbconfig.url+currentDatabase+currentCollection);
var conn = mongoose.createConnection(dbconfig.url+currentDatabase+currentCollection);



var datestampVal = [valFunction.datestampValidator, 
                    "Path '{PATH}' ('{VALUE}'): the datestamp format must be '2017-09-27'"
                   ];

var codeVal = [valFunction.codeValidator, 
               "Path '{PATH}' ('{VALUE}'): the code must be composed by exactly 3 letters, such as 'SSU'"
              ];

var itemsTimeVal = [valFunction.itemsTimeValidator, 
                    "Path '{PATH}' ('{VALUE}'): the time format must be '12:05'"
                   ];

var itemsNumberVal = [valFunction.itemsNumberValidator, 
                      "Path '{PATH}' ('{VALUE}'): the number format must be the last fourth digits, for instance '8875'"
                     ];

var itemsDurationVal = [valFunction.itemsDurationValidator, 
                        "Path '{PATH}' ('{VALUE}'): the duration must be numeric (seconds)"
                       ]; 

/* Create a new mongoose schema and assign it to my schema */

var callSchema = Schema({
    // the user id from community
    userid: {
        type: String,
        unique : false,
        required: [true, 'Userid must be provided'],
        lowercase: true,
        trim: true   // save strings " hello", "hello ", "  hello" in the same way, that is "hello"
    },
    
    // the code of the measurement
    mcode: {
        type: String,
        unique : false,
        required: [true, 'Measurement Code must be provided'],
        uppercase: true,
        maxlength: 3, 
        minlength: 3,
        validate: codeVal   // validate format 'SUM'
    },
    sensorid: {
        type: String,
        unique : false,
        required: [true, 'Sensorid must be provided'],
        uppercase: true,
        trim: true
    },
    time: {
        temporality : {
            type : String,
            enum: ["datestamp"]
        },
        dt : {
            type : String,
            maxlength: 10,
            minlength: 10,
            validate: datestampVal   // validate format '2017-09-27'
        } 
    },
    data: { 
        items : [{
            number : {
                type: String,
                validate: itemsNumberVal   // last fourth number digits
            },
            duration:{
                type: Number,
                min: 0,
                validate: itemsDurationVal   // duration validation
            },
            type : {
                type : String,
                enum : dbconfig.type   // choosen between 'IN' and 'OUT'
            },
            time : {
                type : String,
                maxlength: 5,
                validate: itemsTimeVal   // validate format '12:05'  
            }
        }]
    },
    // Hide __v attribute on query
    __v: { 
        type: Number, 
        select: false
    }
    
}, {timestamps: true});

/* 
  Compile to a model
  The first argument is the unique collection name;
  The second argument is the schema to be used to create the model
*/
module.exports = conn.model('Call', callSchema);
