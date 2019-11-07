var express = require('express');
var router = express.Router();

var { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');

router.get('/', function(req, res, next){
    res.render('misc/info');
})

module.exports = router;