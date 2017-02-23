var Q = require('q');
var models = require("../models"); //추가한 부분.

module.exports = {
	getList : function (limit){
		var deferred = Q.defer();
		models.blogCrawler.find({
			limit : limit,
			order : 'url DESC'
		}).then(function (result){
			deferred.resolve(result);
		}).catch(function(err){
			deferred.reject(err);
		});
		return deferred.promise;
	}
}
