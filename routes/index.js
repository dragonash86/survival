var express = require('express');
var router = express.Router();
var VIEW_PATH = "product/";
var dateFormat = require('dateformat');
var pssUtil = require('../util/pssUtil');
var validUtil = require('../util/validationParamter');
// var
var todaySecurityService = require('../service/todaySecurityService');
var async = require('async');
var boardService = require('../service/boardService');
var blogService = require('../service/blogService');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/join', function(req, res, next) {
    res.render('join');
});

router.get('/ransomware', function(req, res, next) {
    res.render('ransomware');
});

router.get('/partnership', function(req, res, next) {
    res.render('partnership');
});

router.get('/product/:name', function(req, res, next) {
  res.render( VIEW_PATH + req.params.name, { title: 'Express' });
});

router.get('/mainNewsletterAPI' , function (req ,res ,next){
  res.setHeader('Cahce-Control', 'max-age=3600');
  function getColumn(callback){
      boardService.getBoardList(1 , 1 , 'column' , null).then(function (result){
        callback(null , {
          id : result.data[0].id,
          title : result.data[0].title,
          content : result.data[0].thumbnail_text == null ? result.data[0].content : result.data[0].thumbnail_text
        });
      }).catch(function(err){
        callback(err, null);
      });
  }

  function getCommonSense(callback){
      boardService.getBoardList(1 , 1 , 'commonSense' , null).then(function (result){
        callback(null , {
          id : result.data[0].id,
          title : result.data[0].title,
          content : result.data[0].thumbnail_text == null ? result.data[0].content : result.data[0].thumbnail_text
        });

      }).catch(function(err){
        callback(err, null);
      });
  }

  function getALYacBlog(callback){
    blogService.getList(1).then(function(result){
      callback(null , result);
    }).catch(function (err){
      callback(err , null);
    });
  } 

  function getSecurityVulnerability(callback){
    boardService.getBoardList(2 , 1 , 'securityVulnerability' , null).then(function (result){
      var returnData = [];

      for(var key in result.data){
          returnData.push({
              'id' : result.data[key].id,
              'title' : result.data[key].title,
              'content' : result.data[key].thumbnail_text == null ? result.data[key].content : result.data[key].thumbnail_text
          });
      }
      callback(null ,returnData);
      }).catch(function(err){
        callback(err, null);
      });
  }


  async.parallel([
      getColumn , getCommonSense , getALYacBlog , getSecurityVulnerability
  ], function (err,result){
      if(err){
        console.log(err);
        next(err);
      }
      var jsonResult = {};
      jsonResult.result = true;
      jsonResult.data = {
        'column' : result[0],
        'commonSense' :result[1],
        'alyacBlog' : result[2],
        'securityVulnerability' : result[3]
      };
      res.json(jsonResult);
  });
});

router.get('/today/security',function(req,res,next){
    res.setHeader('Cahce-Control', 'max-age=3600');
    var json = {
        'result' : true,
        'date' :  dateFormat(new Date(), "yyyy.mm.dd"), //new Date().format("yyyy-MM-dd"),
    };
    todaySecurityService.getTodaySecurityLevel().then(function (result) {
        json.securitLevel = result[0].level;
        res.json(json);
    }).catch(function (err) {
        console.log(err);
        json.result = false;
        json.securitLevel = 'NORMAL';
        res.json(json);
    });
});
router.get('/privateapi/getSecurityCenterNews' , function(req, res, next){
   boardService.getBoardList(10,1,'news','제품소식').then(function (result) {
        result.nowPage = 1;
        res.json(result);
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
})
module.exports = router;
