var mongoose = require('mongoose');
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;

//var Time = require('./time.js');
//var SingleMessageItem = require('./singleMessageItem.js');

var currentDatabase = "/measurements";
var currentCollection = "/messages";

mongoose.Promise = global.Promise;

var conn = mongoose.createConnection(dbconfig.url+currentDatabase+currentCollection);

function datestampValidator (val) {
    var dtSplitted =  val.split("-");
    if(dtSplitted.length != 3 || dtSplitted[0].length != 4 || dtSplitted[1].length != 2 || dtSplitted[2].length != 2){
        return false;
    }
    return !(isNaN(dtSplitted[0]) || isNaN(dtSplitted[1]));
}

function itemsTimeValidator (val) {
    var timeSplitted =  val.split(":");
    if(timeSplitted.length != 2 || timeSplitted[0].length != 2 || timeSplitted[1].length != 2){
        return false;
    }
    return (/^\d+$/.test(timeSplitted[0]) && /^\d+$/.test(timeSplitted[1]))
}

function itemsNumberValidator (val) {
    /*console.log(""+val); // Problemi con lo 0 iniziale
    if(!/^\d+$/.test(val)){
        console.log("Formato non intero/numerico");
        return false;
    }
    if(val.length != 4){
        console.log("Numero deve essere di 4 cifre");
        return false;
    }
    console.log("Allora è accettato");
    return true;*/
    return true;
}

var datestampVal = [datestampValidator, "Path '{PATH}' ('{VALUE}'): the datestamp format must be '2017-09-27'"];
var itemsTimeVal = [itemsTimeValidator, "Path '{PATH}' ('{VALUE}'): the time format must be '12:05'"];
var itemsNumberVal = [itemsNumberValidator, "Path '{PATH}' ('{VALUE}'): the number format must be the last fourth digits, for instance '8875'"];

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
        maxlength: 3, 
        uppercase: true
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
                maxlength: 4,
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
