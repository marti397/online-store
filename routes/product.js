var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//Get all products page
router.get('/todo', function(req, res, next) {
  var flashMessage = req.flash('success')[0];
  Product.find({}, function(err, docs){
    res.render('shop/product', { title: 'MUJER / ACCESORIOS', products: docs, messages: flashMessage, noMessage: !flashMessage});
  });
});

//Get products page
router.get('/:id', function(req, res, next) {
    var flashMessage = req.flash('success')[0];
    var productType = req.params.id
    var myTitle = 'MUJER / ' + productType
    Product.find({type: productType}, function(err, docs){
      res.render('shop/product', { title: myTitle, products: docs, messages: flashMessage, noMessage: !flashMessage});
    });
});

module.exports = router;