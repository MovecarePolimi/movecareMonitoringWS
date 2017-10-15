var mongoose = require('mongoose');    
var dbconfig = require('../config.js');

var TimeSchema = new mongoose.Schema({ 
    temporality : {
        type : String,
        //enum : dbconfig.temporality
    },
    dt : {
        type : String
        // ci vuole un validator
    }
});

module.exports = mongoose.model('Time', TimeSchema);