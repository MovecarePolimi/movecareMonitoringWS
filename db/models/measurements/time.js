var mongoose = require('mongoose');    
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;

var TimeSchema = new Schema({ 
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