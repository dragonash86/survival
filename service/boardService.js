/**
 * Created by YangsAnalysis on 2016-12-20.
 */
var Q = require('q');
var models = require("../models"); //추가한 부분.
var ACCEPT_TYPE_LIST = ['news','column','securityReport' , 'newsletter' , 'commonSense' , 'securityVulnerability' , 'malwareReport'];
var ACCEPT_CATEGORY = ['제품소식','보안이슈','고객센터','파트너사','기타' , 'PC일반' , '해킹',];
var async = require('async');
var NOT_FOUND = "NOT_FOUND";

module.exports = {
    getBoardContent : function(index , board){
        function getBoardContents (callback) {
            var where = {};
            where.id = index;
            where.board = board;

            models.board.find({
                where : where
            }).then(function (result){
                if(result == null){
                    callback(NOT_FOUND , null);
                }else{
                    callback(null ,result);
                }
            }).catch(function (err){
                console.log('err' , err);
                callback(err);
            });
        }

        function getProvContents (contents, callback) {
            var result = {
                contents : contents
            };
            var where = {
                id : {
                    $lt : contents.id
                },
                board : contents.board
            };
            models.board.find({
                where : where,
                order : 'id DESC',
                limit : 1
            }).then(function (provResult){
                if(provResult == null){
                    result.prov = null;
                    callback(null , result);
                }else{
                    result.prov =  {
                        title : provResult.title,
                        id : provResult.id
                    };
                    callback(null ,result);
                }

            }).catch(function (err){
                console.log(err);
                callback(err, null);
            });
        }

        function getNextContents (result, callback) {
            var where = {
                id : {
                    $gt:result.contents.id
                },
                board : result.contents.board
            };
            models.board.find({
                where : where,
                order : 'id ASC',
                limit : 1
            }).then(function (nextResult){
                console.log("next : " + nextResult);
                if(nextResult == null){
                    result.next = null;
                    callback(null , result);
                }else{
                    result.next =  {
                        title : nextResult.title,
                        id : nextResult.id
                    };
                    callback(null ,result);
                }
            }).catch(function (err){
                callback(err, null);
            });
        }

        var deferred = Q.defer();
        async.waterfall([ getBoardContents , getProvContents, getNextContents ], function(err, result){
            if(err == NOT_FOUND){
                //결과가 없는건 Exception이 아닌 정상로직을 타게 해야함.
                deferred.resolve(null);
            }else if (err) {
                //그외에 다른 에러는 Exception으로 돌린다.
                deferred.reject(err);
            }else{
                //성공을 했으니, 데이터를 넘긴다.
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },
    getBoardList: function(pageMaxSize , page, boardName  , category){
        var maxPage = page - 1;
        var deferred = Q.defer();

        if(ACCEPT_TYPE_LIST.contains(boardName) == false || ((category != undefined && category != null) && ACCEPT_CATEGORY.contains(category) == false )){
            deferred.reject({});
            return deferred.promise;
        }

        var where = {};
        where.board = boardName;
        if(category != undefined || category != null){
            where.category = category;
        }
        models.board.findAndCountAll({
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