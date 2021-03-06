var mongoose = require('mongoose');    
var dbconfig = require('../../config.js');
var SingleMessageItem = require('./singleMessageItem.js');
var Schema = mongoose.Schema;

var ItemsSchema = new Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SingleMessageItem' }]
});

module.exports = mongoose.model('MessageItems', ItemsSchema);