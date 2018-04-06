
/*   PRIVATE FUNCTIONS   */

function stringContainsOnlyNumbers(val) {
    if(/^\d+$/.test(val)){
        return true;
    }
    console.log("Non Integer/Numeric format: "+val);
    return false;
}

function stringContainsOnlyLetters(val) {
    if(/^[a-zA-Z]+$/.test(val)){
        return true;
    }
    console.log("Non only-letters format: "+val);
    return false;
}

function pad_with_zeroes(number) {
    var numberSize = 4;
    
    var my_string = '' + number;
    while (my_string.length < numberSize) {
        my_string = '0' + my_string;
    }

    return my_string;

}


module.exports = {
    datestampValidator: function(val) {
        var dtSplitted =  val.split("-");
        var year = dtSplitted[0];
        var month = dtSplitted[1];
        var day = dtSplitted[2];
        if(dtSplitted.length == 3 && year.length == 4 && month.length == 2 && day.length == 2 &&
          stringContainsOnlyNumbers(year) && stringContainsOnlyNumbers(month) && stringContainsOnlyNumbers(day)){ 
                return true;
        }
        console.log("Datestamp format not valid");
        return false;
    },
    
    codeValidator: function(val){
        if (val.length == 3 && stringContainsOnlyLetters(val)){
            return true;
        }
        console.log("Code format not valid");
        return false;
    },
    
    itemsTimeValidator: function(val) {
        var timeSplitted =  val.split(":");
        var hours = timeSplitted[0];
        var minutes = timeSplitted[1];
        if(timeSplitted.length == 2 && hours.length == 2 && minutes.length == 2 &&
          stringContainsOnlyNumbers(hours) && stringContainsOnlyNumbers(minutes)){
            return true;
        }
        console.log("Time format not valid");
        return false;
    },
    
    itemsDurationValidator: function(val) {
        if(stringContainsOnlyNumbers(val)){
            return true;
        }
        console.log("Duration format not valid");
        return false;
    }, 
    
    itemsNumberValidator: function(val){
        
        if (val.length < 4){
            console.log("Pad zeroes required");
            val = pad_with_zeroes(val);
        }
        if(val.length == 4 && stringContainsOnlyNumbers(val)){
            return true;
        }
        console.log("Number format not valid");
        return false;
    }
    /*stringContainsOnlyNumbers: function(val) {
        if(!/^\d+$/.test(val)){
            console.log("Non Integer/Numeric format: "+val);
            return false;
        }
        console.log("OnlyNumbers true");
        return true;
    },*/

    
}
