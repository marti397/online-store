var express = require('express');
var router = express.Router();

var { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var Order = require('../models/order');
var User = require('../models/user');

router.get('/', function(req, res, next){
    if (req.query.checkOrderNo){
        Order.find({orderId:req.query.checkOrderNo}, function(err, docs){
            if (err){return res.write('Error!');}
            res.render('misc/info', {mydata:docs});
        })
    }else{
        console.log('HOLA')
        res.render('misc/info');
    }
})

module.exports = router;