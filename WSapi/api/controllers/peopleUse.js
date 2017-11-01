'use strict';

var util = require('util');
var PeopleUse = require('../../../db/models/indicators/peopleUse');

var SinglePeopleItem = require('../../../db/models/indicators/singlePeopleItem');

module.exports = {
  allpeopleuse: getAllPeopleUse,
  newPeopleUse : savePeopleUse
};

function getAllPeopleUse(req, res) {
    
    PeopleUse.find({}, { _id: 0, updatedAt: 0, createdAt: 0 }, function(err, peopleUse) {
        if(err) res.json(err.message);
        
        res.json(peopleUse);
    });
}


function savePeopleUse (req, res){
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    
    // Calculate time
    var myTime = {
        temporality : req.swagger.params.newPeopleUse.value.time.temporality,
        dt : req.swagger.params.newPeopleUse.value.time.dt
    };
    
    var itemsArray = [];
    // Create data structure
    var dataLength = req.swagger.params.newPeopleUse.value.data.items.length; 
    for(var i=0; i<dataLength; i++){
        
        // Create single data>items instance
        var peopleItem = new SinglePeopleItem({
            log : req.swagger.params.newPeopleUse.value.data.items[i].log,
            number : req.swagger.params.newPeopleUse.value.data.items[i].number,
            total : req.swagger.params.newPeopleUse.value.data.items[i].total,
            type : req.swagger.params.newPeopleUse.value.data.items[i].type,
            duration : req.swagger.params.newPeopleUse.value.data.items[i].duration
        });
        
        itemsArray.push(peopleItem);
    } 
    
    var myItems = {
        items : itemsArray
    }
    var peopleUse = new PeopleUse({
        userid : req.swagger.params.newPeopleUse.value.userid,
        icode : req.swagger.params.newPeopleUse.value.icode,
        time : myTime,
        data : myItems
    });
    
    peopleUse.save(function(err, doc){
        if (err){
            console.log("---> ERROR <--- !");
            res.json({
                success:false,
                error: err.message
            });
        }
        else{
            console.log("PEOPLE_USE stored");
            res.json({success:true});
        }
    });
    console.log(" --> END");
}