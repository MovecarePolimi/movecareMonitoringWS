var mongoose = require('mongoose');
var dbconfig = require('../../config.js');
var indicatorConfig = require('../configIndicator.js');
var Schema = mongoose.Schema;
var valFunction = require("../validationFunction.js");


var currentDatabase = dbconfig.indicators;
var currentCollection = dbconfig.PSU;    // peopleUse

mongoose.Promise = global.Promise;

console.log("************ PEOPLE_USE--> "+dbconfig.url+currentDatabase);
var conn = mongoose.createConnection(dbconfig.url+currentDatabase);

var datestampVal = [valFunction.datestampValidator, 
                    "Path '{PATH}' ('{VALUE}'): the datestamp format must be '2017-09-27'"
                   ];

var codeVal = [valFunction.codeValidator, 
               "Path '{PATH}' ('{VALUE}'): the code must be composed by exactly 3 letters, such as 'SSU'"
              ];

var itemsNumberVal = [valFunction.itemsNumberValidator, 
                      "Path '{PATH}' ('{VALUE}'): the number format must be the last fourth digits, for instance '8875'"
                     ];

/*  Create a new mongoose schema and assign it to my schema  */
var peopleUseSchema = Schema({

    // the user id from community
    userid: {
        type: String,
        unique : false,
        required: [true, 'Userid must be provided'],
        lowercase: true,
        trim: true   // save strings " hello", "hello ", "  hello" in the same way, that is "hello"
    },
    
    // the code of the measurement
    icode: {
        type: String,
        unique : false,
        required: [true, 'Indicator Code must be provided'],
        uppercase: true,
        maxlength: 3, 
        minlength: 3,
        validate: codeVal   // validate format 'SUM'
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
            log : {
                type: String,
                enum: indicatorConfig.logs 
            },
            number : {
                type: String,
                validate: itemsNumberVal   // last fourth number digits
            },
            total : {
                type : Number,
                min : 0
            },
            type: {
                type: String,
                enum: dbconfig.type
            },
            duration: {
                type: Number,
                required: false,
                min: 0
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
module.exports = conn.model('PeopleUse', peopleUseSchema);
