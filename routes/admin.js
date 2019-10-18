var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//Get the main admin page
router.get('/', function(req, res, next) {
    var flashMessage = req.flash('error');
  res.render('user/admin', {messages: flashMessage, noMessage: !flashMessage});
});

//read all products for admin
router.get('/product', function(req, res, next) {
    var flashMessage = req.flash('error');
    Product.find({}, function(err, docs){
        res.render('user/admin-product', {products: docs, messages: flashMessage, noMessage: !flashMessage});
      });
});

//update products
router.post('/update-product', function(req, res, next){
    var flashMessage = req.flash('error');
    Product.findByIdAndUpdate(req.body.custId, {
        title:req.body.title,
        descr:req.body.descr,
        details:req.body.details,
        price:req.body.price,
        type:req.body.type,
        style:req.body.style
    }, function(err,result){
        res.redirect('/admin/product');
    });
});

//add product
router.post('/add-product', function(req, res, next){
    var flashMessage = req.flash('error');
    var newProduct = new Product({
        imagePath: req.body.img,
        title:req.body.title,
        descr:req.body.descr,
        details:req.body.details,
        price:req.body.price,
        type:req.body.type,
        style:req.body.style
    });

    newProduct.save(function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/product');
    });
});

//delete product
router.post('/delete-product', function(req, res, next){
    var flashMessage = req.flash('error');
    Product.findByIdAndRemove(req.body.custId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/product');
    });
});

module.exports = router;