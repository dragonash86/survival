/**
 * Created by YangsAnalysis on 2016-12-05.
 */
module.exports = {
    valid : function(body , validList){
        var isResult = true;
        for(var key in validList){
            if(body[key] == undefined){
                isResult = false;
                break;
            }
        }
        return isResult;
    }
}