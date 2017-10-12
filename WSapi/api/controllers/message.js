'use strict';

var util = require('util');
var Message = require('../../../db/models/message');

module.exports = {
  allmessages: getAllmessages,
  newMessage : saveMessage
};

function getAllmessages(req, res) {
  var arr = [];
    Message.find({}, function(err, messages) {
        console.log("Message Controller");
        
        if(err) res.json(err.message);
        
        for (var i = 0; i < messages.length; i++) {
            console.log("messaggio trovato");
            arr[i] = {
                userid: messages[i].userid,
                mcode: messages[i].mcode,
                sensorid: messages[i].sensorid,
                time: messages[i].time,
                data: messages[i].data,
            }
        }
        res.json(arr);
    });
}

function saveMessage (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var mess = new Message({
        userid : req.swagger.params.newMessage.value.userid,
        mcode : req.swagger.params.newMessage.value.mcode
    });
    
    var messageReceived = util.format('Ricevuto, %s - %s!', mess.userid, mess.mcode);
    console.log("_*_*_*_*_"+messageReceived);

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
}
