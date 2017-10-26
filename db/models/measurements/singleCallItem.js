var mongoose = require('mongoose');    
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;

var CallItemSchema = new Schema({ 
    number : Number,
    duration: Number,
    type : {
        type : String
        //enum : dbconfig.type
    },
    time : {
        type : String
    }
});

module.exports = mongoose.model('SingleCallItem', CallItemSchema);