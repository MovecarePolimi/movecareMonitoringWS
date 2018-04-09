'use strict';

var util = require('util');
var Message = require('../../../db/models/measurements/message');

var SingleMessageItem = require('../../../db/models/measurements/singleMessageItem');

var commonFunctions = require("./commonFunctions");

module.exports = {
  allmessages: getAllmessages,
  messagesByUserID: getMessagesByUserID,
  newMessage : saveMessage
};

function getAllmessages(req, res) {

    /*Message
        .find({}, { _id: 0, updatedAt: 0, createdAt: 0 })
        .populate("data.items")
        .exec(function (err, messages) {
            if(err) res.json(err.message);
            
            res.json(messages);
        });*/
    Message.find({}, { updatedAt:0, createdAt:0, _id:0, __v:0 }, function(err, messages) {
        if(err) res.json(err.message);
        
        res.json(messages);
    });
}

function getMessagesByUserID(req, res) {

    var userID = req.swagger.params.userID.value;
    console.log("Message : userID is "+userID);

    if(userID == null || userID.size == 0){
        console.log("Message : userID is NULL");
        commonFunctions.sendNegativeResponse(res, "Null object received");
        return;
    }

    Message.find({"userid" : userID.toString()}, { updatedAt:0, createdAt:0, _id:0, __v:0 },
                 function(err, messages) {
                    if(err) res.json(err.message);

                    console.log("*** FOUND: "+messages.toString());
                    res.json(messages);
    });
}


function saveMessage (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    
    // Calculate time
    var myTime = {
        temporality : req.swagger.params.newMessage.value.time.temporality,
        dt : req.swagger.params.newMessage.value.time.dt
    };
    console.log("**** TIME CREATO VALE: "+myTime.temporality +" - "+ myTime.dt)
    
    var itemsArray = [];
    // Create data structure
    var dataField = req.swagger.params.newMessage.value.data;

    if(dataField == null){
        console.log("**** DATA FIELD IS NULL ****");
        commonFunctions.sendNegativeResponse(res, "Null object received");
        return;
    }

    var itemsField = req.swagger.params.newMessage.value.data.items;
    if(itemsField == null){
        console.log("**** ITEMS FIELD IS NULL ****");
        commonFunctions.sendNegativeResponse(res, "Null object received");
        //sendResponse(res, "Null object received");
        return;
    }

    var dataLength = req.swagger.params.newMessage.value.data.items.length;
    
    for(var i=0; i<dataLength; i++){
        // Create single data>items instance
        var messItem = new SingleMessageItem({
            number : req.swagger.params.newMessage.value.data.items[i].number,
            type : req.swagger.params.newMessage.value.data.items[i].type,
            time : req.swagger.params.newMessage.value.data.items[i].time
        });

        itemsArray.push(messItem);

        //console.log("Salvato in array: "+itemsArray[i].number+" - "+itemsArray[i].type+" - "+itemsArray[i].time);
    } 
    //console.log("ITEMS ARRAY vale: "+itemsArray);
    
    var myItems = {
        items : itemsArray
    }
    var mess = new Message({
        userid : req.swagger.params.newMessage.value.userid,
        mcode : req.swagger.params.newMessage.value.mcode,
        sensorid : req.swagger.params.newMessage.value.sensorid,
        time : myTime,
        data : myItems
    });
    //console.log("**** TIME INSERITO VALE: "+mess.time.temporality +" - "+ mess.time.dt)
    //console.log("**** ITEMSss INSERITO VALE: "+mess.data.items[0])
    

    mess.save(function(err, doc){
        if (err){
            console.log("---> ERROR <--- !");
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

// tutto separato, items e singlemessageitems
/*function saveMessage (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    //console.log("%s ++ %s ++ %s", req.swagger.params.newMessage.value.data.items[0].number, req.swagger.params.newMessage.value.data.items[0].type, req.swagger.params.newMessage.value.data.items[0].time);
    
    // Calculate time
    var myTime = {
        temporality : req.swagger.params.newMessage.value.time.temporality,
        dt : req.swagger.params.newMessage.value.time.dt
    };
    console.log("**** TIME CREATO VALE: "+myTime.temporality +" - "+ myTime.dt)
    
    var itemsArray = new Items({});
    // Create data structure
    var dataLength = req.swagger.params.newMessage.value.data.items.length;
    console.log("DATA LENGTH vale :"+dataLength);
    
    for(var i=0; i<dataLength; i++){
        
        // Create single data>items instance
        var messItem = new SingleMessageItem({
            number : req.swagger.params.newMessage.value.data.items[i].number,
            type : req.swagger.params.newMessage.value.data.items[i].type,
            time : req.swagger.params.newMessage.value.data.items[i].time
        });
        
        itemsArray.items.push(messItem);
        
        console.log("Salvato in array: "+itemsArray.items[i].number+" - "+itemsArray.items[i].type+" - "+itemsArray.items[i].time);
    } 
    console.log("ITEMS ARRAY vale: "+itemsArray);
    
    var mess = new Message({
        userid : req.swagger.params.newMessage.value.userid,
        mcode : req.swagger.params.newMessage.value.mcode,
        sensorid : req.swagger.params.newMessage.value.sensorid,
        time : myTime,
        data : itemsArray
    });
    console.log("**** TIME INSERITO VALE: "+mess.time.temporality +" - "+ mess.time.dt)
    console.log("**** ITEMSss INSERITO VALE: "+mess.data.items)
    console.log("_*_*_*_*_ SONO QUI");
    
    mess.save(function(err, doc){
        if (err){
            console.log("---- ERRRR!");
            // questo dà errore
            res.json({
                message: err.message
            });
        }
        else{
            console.log("---- NESSUN ERRRR!");
            res.json({
                success: 1,
                description: "Utente Salvato"
            });
        }
    });
    console.log(" --> END");
}*/


/*function saveMessage (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    //console.log("%s ++ %s ++ %s", req.swagger.params.newMessage.value.data.items[0].number, req.swagger.params.newMessage.value.data.items[0].type, req.swagger.params.newMessage.value.data.items[0].time);
    
    // Calculate time
    var myTime = {
        temporality : req.swagger.params.newMessage.value.time.temporality,
        dt : req.swagger.params.newMessage.value.time.dt
    };
    console.log("**** TIME CREATO VALE: "+myTime.temporality +" - "+ myTime.dt)
    
    var itemsArray = new Items({});
    // Create data structure
    var dataLength = req.swagger.params.newMessage.value.data.items.length;
    console.log("DATA LENGTH vale :"+dataLength);
    
    for(var i=0; i<dataLength; i++){
        
        // Create single data>items instance
        var messItem = new SingleMessageItem({
            number : req.swagger.params.newMessage.value.data.items[i].number,
            type : req.swagger.params.newMessage.value.data.items[i].type,
            time : req.swagger.params.newMessage.value.data.items[i].time
        });
        
        itemsArray.items.push(messItem);
        
        console.log("Salvato in array: "+itemsArray.items[i].number+" - "+itemsArray.items[i].type+" - "+itemsArray.items[i].time);
    } 
    console.log("ITEMS ARRAY vale: "+itemsArray);
    
    var mess = new Message({
        userid : req.swagger.params.newMessage.value.userid,
        mcode : req.swagger.params.newMessage.value.mcode,
        sensorid : req.swagger.params.newMessage.value.sensorid,
        time : myTime,
        data : itemsArray
    });
    console.log("**** TIME INSERITO VALE: "+mess.time.temporality +" - "+ mess.time.dt)
    console.log("**** ITEMSss INSERITO VALE: "+mess.data.items)
    console.log("_*_*_*_*_ SONO QUI");
    
    mess.save(function(err, doc){
        if (err){
            console.log("---- ERRRR!");
            // questo dà errore
            res.json({
                message: err.message
            });
        }
        else{
            console.log("---- NESSUN ERRRR!");
            res.json({
                success: 1,
                description: "Utente Salvato"
            });
        }
    });
    console.log(" --> END");
}*/

