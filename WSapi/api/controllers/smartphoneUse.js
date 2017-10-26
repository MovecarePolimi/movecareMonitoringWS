'use strict';

var util = require('util');
var SmartphoneUse = require('../../../db/models/indicators/smartphoneUse');

var SingleSmartphoneItem = require('../../../db/models/indicators/singleSmartphoneItem');

module.exports = {
  allsmartphoneuse: getAllSmartphoneUse,
  newSmartphoneUse : saveSmartphoneUse
};

function getAllSmartphoneUse(req, res) {
    
    SmartphoneUse.find({}, { _id: 0, updatedAt: 0, createdAt: 0 }, function(err, smartphoneUse) {
        if(err) res.json(err.message);
        
        res.json(smartphoneUse);
    });
}


function saveSmartphoneUse (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    
    // Calculate time
    var myTime = {
        temporality : req.swagger.params.newSmartphoneUse.value.time.temporality,
        dt : req.swagger.params.newSmartphoneUse.value.time.dt
    };
    
    var itemsArray = [];
    // Create data structure
    var dataLength = req.swagger.params.newSmartphoneUse.value.data.items.length; 
    for(var i=0; i<dataLength; i++){
        
        // Create single data>items instance
        var smartphoneItem = new SingleSmartphoneItem({
            name : req.swagger.params.newSmartphoneUse.value.data.items[i].name,
            value : req.swagger.params.newSmartphoneUse.value.data.items[i].value,
            units : req.swagger.params.newSmartphoneUse.value.data.items[i].units
        });
        
        itemsArray.push(smartphoneItem);
    } 
    
    var myItems = {
        items : itemsArray
    }
    var smartphoneUse = new SmartphoneUse({
        userid : req.swagger.params.newSmartphoneUse.value.userid,
        icode : req.swagger.params.newSmartphoneUse.value.icode,
        time : myTime,
        data : myItems
    });
    
    smartphoneUse.save(function(err, doc){
        if (err){
            console.log("---- ERRRR!");
            res.json({
                success:false,
                error: err.message
            });
        }
        else{
            console.log("MESSAGE stored");
            res.json({success:true});
        }
    });
    console.log(" --> END");
}