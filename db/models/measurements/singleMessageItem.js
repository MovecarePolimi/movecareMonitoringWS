var mongoose = require('mongoose');    
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;

var MessageItemSchema = new Schema({ 
    number : Number,
    type : {
        type : String
        //enum : dbconfig.type
    },
    time : {
        type : String
    }
});

module.exports = mongoose.model('SingleMessageItem', MessageItemSchema);