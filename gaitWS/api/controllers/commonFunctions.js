

module.exports = {
    sendNegativeResponse: negativeResponse,
    sendPositiveResponse: positiveResponse
};

function negativeResponse(res, text){
    res.json({
        success:false,
        error: text
    });
}

function positiveResponse(res, text){

}
