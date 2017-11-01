var mongoose = require('mongoose');
var dbconfig = require('../../config.js');
var indicatorConfig = require('../configIndicator.js');
var Schema = mongoose.Schema;
var valFunction = require("../validationFunction.js");

var currentDatabase = dbconfig.indicators;
var currentCollection = dbconfig.SSU;  // smartphoneUse";

mongoose.Promise = global.Promise;

var conn = mongoose.createConnection(dbconfig.url+currentDatabase+currentCollection);

var datestampVal = [valFunction.datestampValidator, 
                    "Path '{PATH}' ('{VALUE}'): the datestamp format must be '2017-09-27'"
                   ];

var codeVal = [valFunction.codeValidator, 
               "Path '{PATH}' ('{VALUE}'): the code must be composed by exactly 3 letters, such as 'SSU'"
              ];


/*  Create a new mongoose schema and assign it to my schema  */
var smartphoneUseSchema = Schema({

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
            name : {
                type: String,
                enum: indicatorConfig.values 
            },
            value : {
                type : Number,
                min: 0
            },
            units : {
                type : String,
                enum : indicatorConfig.units
            }
        }]
    },
    // Hide __v attribute on query
    __v: { 
        type: Number, 
        select: false
    }
    
}, {timestamps: true});

// Virtuals: sono metodi (getter e setter) che non hanno modifiche persistenti sul db, ma servono solo a un livello prima per formattare i dati. Ad esempio, data una stringa con name + surname, un virtual method può formattare la stringa e dividerla in due (name e surname) prima di effettuare lo storage sul db.

// Statics:
// Statics
/*messageSchema.statics.findByUsername = function(u, cb) {
    return this.find({ username: u }, cb);
};

messageSchema.statics.findByUserID = function(u, cb) {
    return this.find({ userid: u }, cb);
};*/


/* 
  Compile to a model
  The first argument is the unique collection name;
  The second argument is the schema to be used to create the model
*/
module.exports = conn.model('SmartphoneUse', smartphoneUseSchema);
