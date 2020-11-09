var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//filter for all products
router.get('/todo', function(req, res, next) {
  Product.find({}, function(err, docs){
    res.render('shop/product', { title: 'accesorios', products: docs});
  });
});

//Get products page
router.get('/:id', function(req, res, next) {
    var productType = req.params.id
    var myTitle = productType
    Product.find({type: productType}, function(err, docs){
      res.render('shop/product', { title: myTitle, products: docs});
    });
});

//get product detail
router.get('/:id/detail',function(req,res,next){
  var productID = req.params.id;
  var query = Product.findById(productID);
  Product.findById(productID).exec(function(err,result){
    if(err){return next(err)}
    res.render('shop/product-view', {product:result});
  });
})

module.exports = router;

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};