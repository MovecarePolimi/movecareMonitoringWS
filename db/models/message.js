var mongoose = require('mongoose');
var dbconfig = require('../config.js');
//var Time = require('./time.js');
//var SingleMessageItem = require('./singleMessageItem.js');

var currentDatabase = "/measurements";
var currentCollection = "/messages";

mongoose.Promise = global.Promise;

var conn = mongoose.createConnection(dbconfig.url+currentDatabase+currentCollection);

/*
   Create a new mongoose schema and assign it to my schema 
*/

var messageSchema = mongoose.Schema({

    // the user id from community
    userid: {
        type: String,
        unique : false,
        required: [true, 'Userid must be provided']
    },
    
    // the code of the measurement
    mcode: {
        type: String,
        unique : false,
        required: [true, 'Measurement Code must be provided']
    },
    sensorid: {
        type: String,
        unique : false,
        required: [true, 'Sensorid must be provided']
    },
    time: {
        temporality : {
            type : String,
            //enum : dbconfig.temporality
        },
        dt : {
           type : String
           // ci vuole un validator
        } 
    },
    data: { 
        items : [{
            number : Number,
                type : {
            type : String
                //enum : dbconfig.type
            },
            time : {
                type : String
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


	/*"data" : [
		{   "number" : 1234,
			"type": "IN",
			"time": "13:27"
		}
	]*/
