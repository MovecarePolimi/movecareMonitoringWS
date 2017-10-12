var mongoose = require('mongoose');
var dbconfig = require('../config.js');
var currentDatabase = "/measurements";
var currentCollection = "/messages";

mongoose.Promise = global.Promise;

var conn = mongoose.createConnection(dbconfig.url+currentDatabase+currentCollection);

/*
   Create a new mongoose schema and assign it to my schema 
*/

var TimeSchema = new mongoose.Schema({ 
    temporality : {
        type : String,
        lowercase : true,
        enum : dbconfig.temporality
    },
    dt : {
        type : String,
        length : 10
        // ci vuole un validator
    }
});

var MessageItemSchema = new mongoose.Schema({ 
    number : Number,
    type : {
        type : String,
        length : 2,
        enum : dbconfig.type
    },
    time : {
        type : String,
        length : 5
    }
});

var ItemSchema = new mongoose.Schema({
    items: [MessageItemSchema]
});

var messageSchema = mongoose.Schema({

    // the user id from community
    userid: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Userid must be provided']
    },
    
    // the code of the measurement
    mcode: {
        type: String,
        uppercase: true,
        unique: false,
        required: [true, 'Measurement Code must be provided']
    },
    sensorid: {
        type: String,
        unique: false,
        required: [true, 'Sensorid must be provided']
    },
    
    time: TimeSchema,
    
    data: [ItemSchema]

    /*// the duration
    duration: {
        type: Number,
        unique: false,
        required: [true, 'Duration must be provided']
    },*/
    
    // the duration
    /*type: {
        type: String,
        unique: false,
        required: [true, 'Type must be provided'],
        length : 2,
        enum : dbconfig.type
    }*/
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
