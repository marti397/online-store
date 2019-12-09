var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//Get all products page
router.get('/', function(req, res, next) {
    res.render('shop/tendencia');
});

module.exports = router;