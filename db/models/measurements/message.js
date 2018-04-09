var mongoose = require('mongoose');
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;
var valFunction = require("../validationFunction.js");

//var Time = require('./time.js');
//var SingleMessageItem = require('./singleMessageItem.js');

var currentDatabase = dbconfig.measurements;
var currentCollection = dbconfig.SUM    // messages;

mongoose.Promise = global.Promise;

console.log("************ MESSAGE --> "+dbconfig.url+currentDatabase+currentCollection);
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

/*  Create a new mongoose schema and assign it to my schema  */
var messageSchema = Schema({

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
    /*data: {
        items : [{ type: Schema.Types.ObjectId, ref: 'SingleMessageItem'}]  
    }, */ 
    data: { 
        items : [{
            number : {
                type: String,
                validate: itemsNumberVal   // last fourth number digits
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
module.exports = conn.model('Message', messageSchema);
