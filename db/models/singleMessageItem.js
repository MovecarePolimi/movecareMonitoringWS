var mongoose = require('mongoose');    
var dbconfig = require('../config.js');

var MessageItemSchema = new mongoose.Schema({ 
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