var express = require('express');
var router = express.Router();

var Order = require('../models/order');

router.get('/', function(req, res, next){
    if (req.query.checkOrderNo){
        const regex = new RegExp(escapeRegex(req.query.checkOrderNo), 'gi');
        Order.find({orderId:regex}, function(err, docs){
            if (err){return res.write('Error!');}
            var isEmpty = false;
            if (docs.length == 0){
                isEmpty = true;
            }
            res.render('misc/info', {orderdata:docs, empty:isEmpty});
        })
    }else{
        res.render('misc/info');
    }
});

router.get('/customer-service', function(req, res, next){
    res.render('misc/atencion');
});

router.get('/shipping-and-returns', function(req, res, next){
    res.render('misc/envios');
});

router.get('/:id/details', function(req,res, next){
    var search = req.params.id;
    Order.find({orderId:search},function(err,docs){
        if (err){return res.write('Error!');}
        res.render('misc/order-details', {order:docs});
    }) 
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;