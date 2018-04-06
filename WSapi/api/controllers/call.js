'use strict';

var util = require('util');
var Call = require('../../../db/models/measurements/call');

var SingleCallItem = require('../../../db/models/measurements/singleCallItem');

var commonFunctions = require("./commonFunctions");

module.exports = {
  allCalls: getAllcalls,
  newCall : saveCall
};

function getAllcalls(req, res) {

    Call.find({}, { _id: 0, updatedAt: 0, createdAt: 0 }, function(err, calls) {
        if(err) res.json(err.message);
        
        res.json(calls);
    });
}

function saveCall (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}

    // Calculate time
    var myTime = {
        temporality : req.swagger.params.newCall.value.time.temporality,
        dt : req.swagger.params.newCall.value.time.dt
    };
    //console.log("**** TIME CREATO VALE: "+myTime.temporality +" - "+ myTime.dt)
    
    var itemsArray = [];
    // Create data structure
    var dataField = req.swagger.params.newCall.value.data;

    if(dataField == null){
        console.log("**** DATA FIELD IS NULL ****");
        commonFunctions.sendNegativeResponse(res, "Null object received");
        return;
    }

    var itemsField = req.swagger.params.newCall.value.data.items;
    if(itemsField == null){
        console.log("**** ITEMS FIELD IS NULL ****");
        commonFunctions.sendNegativeResponse(res, "Null object received");
        return;
    }

    var dataLength = req.swagger.params.newCall.value.data.items.length;
    
    for(var i=0; i<dataLength; i++){
        
        // Create single data>items instance
        var callItem = new SingleCallItem({
            number : req.swagger.params.newCall.value.data.items[i].number,
            duration : req.swagger.params.newCall.value.data.items[i].duration,
            type : req.swagger.params.newCall.value.data.items[i].type,
            time : req.swagger.params.newCall.value.data.items[i].time
        });
        
        itemsArray.push(callItem);
        
        //console.log("Salvato in array: "+itemsArray[i].number+" - "+itemsArray[i].type+" - "+itemsArray[i].time);
    } 
    //console.log("ITEMS ARRAY vale: "+itemsArray);
    
    var myItems = {
        items : itemsArray
    }
    var call = new Call({
        userid : req.swagger.params.newCall.value.userid,
        mcode : req.swagger.params.newCall.value.mcode,
        sensorid : req.swagger.params.newCall.value.sensorid,
        time : myTime,
        data : myItems
    });
    //console.log("**** TIME INSERITO VALE: "+call.time.temporality +" - "+ call.time.dt)
    //console.log("**** ITEMSss INSERITO VALE: "+call.data.items[0])
    
    call.save(function(err, doc){
        if (err){
            console.log("---> ERROR <--- !");
            res.json({
                success:false,
                error: err.message
            });
        }
        else{
            console.log("CALL stored");
            res.json({success:true});
        }
    });
    console.log(" --> END");
}


