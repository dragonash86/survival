/**
 * Created by YangsAnalysis on 2016-12-06.
 */

var Q = require('q');
var models = require("../models"); //추가한 부분.
var todaySecurityModel = models.todaySecurityLevel;
module.exports = {
    getTodaySecurityLevel : function(){
        var deferred = Q.defer();
        todaySecurityModel.findAll({
            limit : 1,
            order : 'id DESC'
        }).then(function(resultDatabase) {
            deferred.resolve(resultDatabase);
        }).catch(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
}