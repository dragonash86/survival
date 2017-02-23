/**
 * Created by YangsAnalysis on 2016-12-17.
 */
var express = require('express');
var router = express.Router();
var VIEW_PATH = "buy/";

router.get('/:name', function(req, res, next) {
    res.render( VIEW_PATH + req.params.name, { title: 'Express' });
});

module.exports = router;
