var mongoose = require('mongoose');
var dbconfig = require('../../config.js');
var indicatorConfig = require('../configIndicator.js');
var Schema = mongoose.Schema;


var currentDatabase = "/indicators";
var currentCollection = "/peopleUse";

mongoose.Promise = global.Promise;

var conn = mongoose.createConnection(dbconfig.url+currentDatabase+currentCollection);

function datestampValidator (val) {
    var dtSplitted =  val.split("-");
    if(dtSplitted.length != 3 || dtSplitted[0].length != 4 || dtSplitted[1].length != 2 || dtSplitted[2].length != 2){
        return false;
    }
    return !(isNaN(dtSplitted[0]) || isNaN(dtSplitted[1]));
}

function valueValidator (val) {
    // is numeric and integer
    return /^\d+$/.test(val);
}

var datestampVal = [datestampValidator, "Path '{PATH}' ('{VALUE}'): the datestamp format must be '2017-09-27'"];

var valueVal = [valueValidator, "Path '{PATH}' ('{VALUE}'): the value format must be an integer"];

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
        maxlength: 3, 
        uppercase: true
    },
    
    time: {
        temporality : {
            type : String,
            enum: ["datestamp"]
        },
        dt : {
            type : String,
            maxlength: 10,
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
                type : Number,
                validate: valueVal
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
module.exports = conn.model('PeopleUse', peopleUseSchema);
