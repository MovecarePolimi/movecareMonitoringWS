var mongoose = require('mongoose');    
var dbconfig = require('../../config.js');
var Schema = mongoose.Schema;

var SmartphoneItemSchema = new Schema({ 
    name : String,
    value : Number,
    units : String
});

module.exports = mongoose.model('SingleSmartphoneItem', SmartphoneItemSchema);