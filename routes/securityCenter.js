/**
 * Created by yangs on 2016. 11. 26..
 */
var express = require('express');
var router = express.Router();
var models = require("../models"); //추가한 부분.
var moment = require('moment');
var MAX_SIZE = 10;
var boardService = require('../service/boardService');
var env = process.env.NODE_ENV || "development";
// var serverConfig = require(__dirname + '/../config/serverConfig.json')[env];
// var stringResource = require(__dirname + '/../config/stringResource/' + serverConfig['lang']+ '.json');
var dbUpdateService = require('../service/dbUpdateService');


/* GET home page. */
router.get('/tool_download_db', function(req, res, next) {
    res.render('./securityCenter/tool_download_db', { title: 'Express' });
});
router.get('/tool_download_alyac', function(req, res, next) {
    res.render('./securityCenter/tool_download_alyac', { title: 'Express' });
});


router.get('/dbupdate/:type/:page', function(req, res, next) {
    var page = req.params.page;
    var type = req.params.type;
    res.setHeader('Cahce-Control', 'max-age=3600');

    dbUpdateService.getDBUpdateList(MAX_SIZE,type,page).then(function (result){
        result.nowPage = page;
        res.render('securityCenter/dbupdate', {
            result : result,
            engineType : type,
            moment : moment
        });
    }).catch(function (error) {
        next(error);
    });

});

router.get('/dbupdate/last', function(req, res, next) {
    res.setHeader('Cahce-Control', 'max-age=3600');
    dbUpdateService.getDBUpdateCount().then(function(result){
        res.json(result);
    }).catch(function(err){
        next(err);
    });
});

router.get('/column/:page', function (req ,res, next){
    var page = req.params.page;

    boardService.getBoardList(MAX_SIZE,page,'column',undefined).then(function (result) {
        result.nowPage = page;
        res.render('securityCenter/column/list' , {
            result : result,
            moment : moment
        });
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

router.get('/column/view/:index',function (req,res,next) {
    var index = req.params.index;
    boardService.getBoardContent(index , 'column').then(function (result) {
        if(result == null){
            res.render('include/alert',{'message' : '존재하지 않는 게시글이거나 접근권한이 없습니다'});
            return ;
        }
        res.render('securityCenter/column/view' , {
            result : result,
            moment : moment
        });
    }).catch(function(err){
        next(err);
    });
});


router.get('/news/:page',function (req,res,next) {
    var page = req.params.page;
    var category = req.query.category;
    boardService.getBoardList(MAX_SIZE,page,'news',category).then(function (result) {
        result.nowPage = page;
        res.render('securityCenter/news/list' , {
            result : result,
            moment : moment,
        });
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

router.get('/news/view/:index',function (req,res,next) {
    var index = req.params.index;
    boardService.getBoardContent(index , 'news').then(function (result) {
        if(result == null){
            res.render('include/alert',{'message' : '존재하지 않는 게시글이거나 접근권한이 없습니다'});
            return ;
        }
        res.render('securityCenter/news/view' , {
            result : result,
            moment : moment
        });
    }).catch(function(err){
        next(err);
    });
});

router.get('/commonSense/:page',function (req,res,next) {
    var page = req.params.page;
    var category = req.query.category;
    boardService.getBoardList(MAX_SIZE,page,'commonSense',category).then(function (result) {
        result.nowPage = page;
        res.render('securityCenter/commonSense/list' , {
            result : result,
            moment : moment,
        });
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

router.get('/commonSense/view/:index',function (req,res,next) {
    var index = req.params.index;
    boardService.getBoardContent(index , 'commonSense').then(function (result) {
        if(result == null){
            res.render('include/alert',{'message' : '존재하지 않는 게시글이거나 접근권한이 없습니다'});
            return ;
        }
        res.render('securityCenter/commonSense/view' , {
            result : result,
            moment : moment
        });
    }).catch(function(err){
        next(err);
    });
});

router.get('/level',function (req, res, next) {
    res.render('securityCenter/level');
});

router.get('/report/:page',function (req,res,next) {
    var page = req.params.page;
    var category = req.query.category;
    boardService.getBoardList(MAX_SIZE,page,'securityReport',category).then(function (result) {
        result.nowPage = page;
        res.render('securityCenter/report' , {
            result : result,
            moment : moment
        });
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

router.get('/newsletter/:page',function (req,res,next) {
    var page = req.params.page;
    var category = req.query.category;
    boardService.getBoardList(MAX_SIZE,page,'newsletter',category).then(function (result) {
        result.nowPage = page;
        res.render('securityCenter/newsletter/list' , {
            result : result,
            moment : moment
        });
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

router.get('/newsletter/view/:index',function (req,res,next) {
    var index = req.params.index;
    boardService.getBoardContent(index , 'newsletter').then(function (result) {
        if(result == null){
            res.render('include/alert',{'message' : '존재하지 않는 게시글이거나 접근권한이 없습니다'});
            return ;
        }
        res.render('securityCenter/newsletter/view' , {
            result : result,
            moment : moment
        });
    }).catch(function(err){
        next(err);
    });
});

router.get('/securityVulnerability/:page',function (req,res,next) {
    var page = req.params.page;
    var category = req.query.category;
    boardService.getBoardList(MAX_SIZE,page,'securityVulnerability',category).then(function (result) {
        result.nowPage = page;
        res.render('securityCenter/securityVulnerability/list' , {
            result : result,
            moment : moment,
        });
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

router.get('/securityVulnerability/view/:index',function (req,res,next) {
    var index = req.params.index;
    boardService.getBoardContent(index , 'securityVulnerability').then(function (result) {
        if(result == null){
            res.render('include/alert',{'message' : '존재하지 않는 게시글이거나 접근권한이 없습니다'});
            return ;
        }
        res.render('securityCenter/securityVulnerability/view' , {
            result : result,
            moment : moment
        });
    }).catch(function(err){
        next(err);
    });
});

router.get('/malwareReport/:page', function(req, res, next) {
    var page = req.params.page;
    var category = req.query.category;

    boardService.getBoardList(MAX_SIZE,page,'malwareReport',category).then(function (result){
        result.nowPage = page;
        res.render('securityCenter/malwareReport/list', {
            result : result,
            moment : moment
        });
    }).catch(function (error) {
        next(error);
    });

});

router.get('/malwareReport/view/:index',function (req,res,next) {
    var index = req.params.index;
    boardService.getBoardContent(index , 'malwareReport').then(function (result) {
        if(result == null){
            res.render('include/alert',{'message' : '존재하지 않는 게시글이거나 접근권한이 없습니다'});
            return ;
        }
        res.render('securityCenter/malwareReport/view' , {
            result : result,
            moment : moment
        });
    }).catch(function(err){
        next(err);
    });
});




module.exports = router;
