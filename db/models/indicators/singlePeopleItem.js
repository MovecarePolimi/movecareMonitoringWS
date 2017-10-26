var mongoose = require('mongoose');    
var dbconfig = require('../../config.js');
var indicatorConfig = require('../configIndicator.js');
var Schema = mongoose.Schema;

var PeopleItemSchema = new Schema({ 
    log : String,
    number : Number,
    total : Number,
    type : String,
    duration : Number
});

module.exports = mongoose.model('SinglePeopleItem', PeopleItemSchema);