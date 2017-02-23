/**
 * Created by YangsAnalysis on 2016-12-25.
 */
var Q = require('q');
var models = require("../models");
var dbUpdateModel = models.dbUpdate;
var ACCEPT_CATEGORY = ['BIT','TERA'];
// var model 

var moment = require('moment');


module.exports = {
    getDBUpdateList : function(pageMaxSize , type , page){
        var maxPage = page - 1;
        var deferred = Q.defer();

        var where = {};
        if(ACCEPT_CATEGORY.contains(type) == false && (type != null || type != undefined)){
          deferred.reject({'error' : 'type is Not Accept'});
          return deferred.promise;
        }
        where.type = type;
        dbUpdateModel.findAndCountAll({
            where : where,
            limit : pageMaxSize,
            offset : (maxPage * pageMaxSize),
            order : 'date DESC'
        }).then(function(result) {
          var returnData = {
              'pageSize' :   Math.ceil(result.count / pageMaxSize),
              'rowCount' : result.count,
              'data' :   result.rows
            };
            deferred.resolve(returnData);
        }).catch(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    },
    getDBUpdateCount : function(){
      var deferred = Q.defer();

      models.sequelize.query("SELECT * FROM db_update WHERE date = (SELECT max(date) FROM db_update)", { type: models.Sequelize.QueryTypes.SELECT}).then(function(result) {
        var reportCount = 0;
        for(var key in result){
          if(key == "contains"){
              continue;
          }
          reportCount += result[key].content.split("\r\n").length
        }
        deferred.resolve({
          'date' : moment(result[0].date).format("YYYY-MM-DD"),
          'count' : reportCount
        });
      }).catch(function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    }
}
