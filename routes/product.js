var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//Get all products page
router.get('/todo', function(req, res, next) {
  Product.find({}, function(err, docs){
    res.render('shop/product', { title: 'MUJER / ACCESORIOS', products: docs});
  });
});

//Get products page
router.get('/:id', function(req, res, next) {
    var productType = req.params.id
    var myTitle = 'MUJER / ' + productType
    Product.find({type: productType}, function(err, docs){
      res.render('shop/product', { title: myTitle, products: docs});
    });
});

module.exports = router;