var Q = require('q');
var models = require("../models");
var ACCEPT_CATEGORY = ['악성코드문의','제품별문의','구매문의','라이선스','전용백신','기타' , '알약','알약익스플로잇쉴드','알약안드로이드'];

module.exports = {
	getContent : function (userType , id){
		var deferred = Q.defer();
		var where = {
		 id : id,
		 user_type : userType
		};

		models.faq.find({
		 	where : where
		}).then(function (result){
			deferred.resolve(result);
		}).catch(function(err){
			deferred.reject(err);
		});
		return deferred.promise;
	},
	search : function (userType , query , pageMaxSize , page) {
		var maxPage = page - 1;
		var deferred = Q.defer();
		var where = {};
		where.content = {
			$like: '%' + query  + '%'
		};
		where.user_type = userType;
		models.faq.findAndCountAll({
			where : where,
			limit : pageMaxSize,
			offset : (maxPage * pageMaxSize),
			order : 'id DESC'
		}).then(function (result){
			var returnData = {
				'pageSize' :   Math.ceil(result.count / pageMaxSize),
				'rowCount' : result.count,
				'data' :   result.rows
			};
			deferred.resolve(returnData);
		}).catch(function (err){
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	},
	getFAQList : function (userType , category , productType , pageMaxSize , page , isTop){
		var maxPage = page - 1;
		var deferred = Q.defer();

		if(ACCEPT_CATEGORY.contains(category) == false && category  != null) {
		    deferred.reject({});
		    return deferred.promise;
		}

		var where = {};
		where.user_type = userType;

		if(category != null){
			where.category = category;
		}
		if(productType != null){
			where.product_type = productType;
		}

		if(isTop){
			where.is_top = 1;
		}
		models.faq.findAndCountAll({
		    where : where,
		    limit : pageMaxSize,
		    offset : (maxPage * pageMaxSize),
		    order : 'id DESC'
		}).then(function (result){
		    var returnData = {
		      'pageSize' :   Math.ceil(result.count / pageMaxSize),
		      'rowCount' : result.count,
		      'data' :   result.rows
		    };
		    deferred.resolve(returnData);
		}).catch(function (err){
		    console.log(err);
		    deferred.reject(err);
		});

		return deferred.promise;
    }


}
