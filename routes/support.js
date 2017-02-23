/**
 * Created by YangsAnalysis on 2016-12-06.
 */
var express = require('express');
var router = express.Router();
var pssUtil = require('../util/pssUtil');
var validUtil = require('../util/validationParamter');
var stringUtil = require('../util/stringUtil');
var faqService = require('../service/faqService');
var moment = require('moment');
var async = require('async');
var MAX_PAGE_SIZE = 10;
var acceptFAQPageType = ['company' , 'individual']

/* GET home page. */
router.get('/report/enterprise', function(req, res, next) {
    res.render('support/reportEnterprise');
});

router.get('/report', function(req, res, next) {
    res.render( 'support/report');
});

router.get('/support_public', function(req, res, next) {
    res.render( './support/support_public');
});

router.get('/support_enterprise', function(req, res, next) {
    res.render( './support/support_enterprise');
});



router.get('/faq/:pageType/:page' , function ( req , res, next){
  var category = req.query.category;
  var productType = req.query.productType;
  var page = parseInt(req.params.page);
  var pageType = req.params.pageType;
  if(acceptFAQPageType.contains(pageType) == false){
    next({'error' : 'Not Accept Type'});
    return ;
  }

  function getTop5List(callback){
      faqService.getFAQList(pageType.toUpperCase() , null , productType , 5 , 1, true).then(function (result){
        callback(null , result);
      }).catch(function (err) {
        callback(err , null);
      });
  }

  function getList(callback){
      faqService.getFAQList(pageType.toUpperCase() , category , productType , MAX_PAGE_SIZE , page, false).then(function (result){
        callback(null , result);
      }).catch(function (err) {
        callback(err , null);
      });
  }

  async.parallel([getTop5List , getList],function(err , result){
      if(err){
        console.log(err);
        next(err);
      }else{ 
        result[1].nowPage = page;
        res.render('support/faq/'+pageType.toLowerCase()+'/main' , {
          result : result[1],
          top5Result : result[0]
        });
      }
      
  });
});

router.get('/faq/:pageType/search/:page' , function ( req , res, next){
  var page = req.params.page;
  var searchQuery = req.query.q;
  if(searchQuery.length > 15){
    next({'error' : 'Parameter Error'});
    return ;
  }
  var pageType = req.params.pageType;
  if(acceptFAQPageType.contains(pageType) == false){
    next({'error' : 'Not Accept Type'});
    return ;
  }


  if(stringUtil.isNullOrEmpty(searchQuery) == false){
    next({});
    return ;
  }

  faqService.search(pageType.toUpperCase() , searchQuery , 10 , page).then(function (result){
    result.nowPage = page;
    result.searchQuery = searchQuery;
    res.render('support/faq/'+pageType.toLowerCase()+'/search' , {
      result : result
    });
  }).catch(function (err) {
    next(err);
  });
});

router.get('/faq/:pageType/view/:index' , function ( req , res, next){
  var index = parseInt(req.params.index);
  var pageType = req.params.pageType;
  if(acceptFAQPageType.contains(pageType) == false){
    next({'error' : 'Not Accept Type'});
    return ;
  }

  if(stringUtil.isNullOrEmpty(index) == false){
    next({});
    return ;
  }
  faqService.getContent(pageType,index).then(function(result){
    res.render('support/faq/'+pageType.toLowerCase()+'/view' , {
      result : result,
      moment : moment
    });
  }).catch(function (err){
    next(err);
  });
});

router.post('/send/report/:type',function (req,res , next) {
    var checkParameterList = {
        'email' : true,
        'userTel' : true,
        'title' : true,
        'content' : true,
        'reportType' : true,
        'productType' : true
    };
    if(req.params.type == "company"){
        checkParameterList.companyName = true;
        checkParameterList.companyPartName = true;
    }

    if(validUtil.valid(req.body , checkParameterList) == false){
        res.json({
            'result' : false,
            'message' : 'check Parameter'
        });
        return ;
    }
    pssUtil.send(req.body.title , req.body.content , req.body.email , req.body.userTel, req.params.type == "company" ? ('[' + req.body.companyName + ']' + '' + req.body.companyPartName) : '' , req.params.type == "company" ? true : false).then(function () {
        res.json({
            'result' : true
        });
    }).catch(function () {
        res.json({
            'result' : false
        });
    });
});
module.exports = router;
