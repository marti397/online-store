var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Discount = require('../models/discount');

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

//read all discounts for admin
router.get('/discount', function(req, res, next) {
    var flashMessage = req.flash('error');
    Discount.find({}, function(err, docs){
        res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
      });
});

//update products
router.post('/update-product', function(req, res, next){
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

//update discounts
router.post('/update-discount', function(req, res, next){
    Discount.findByIdAndUpdate(req.body.updateDiscount, {
        code: req.body.discountcode,
        isPercent: req.body.percentage == 'true',
        amount:req.body.discountamount,
        expireDate:req.body.discountexpirydate,
        isActive: req.body.active == 'true'
    }, function(err,result){
        res.redirect('/admin/discount');
    });
});

//add product
router.post('/add-product', function(req, res, next){
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

//add discount
router.post('/add-discount', function(req, res, next){
    var newDiscount = new Discount({
        code: req.body.discountcode,
        isPercent: req.body.percentage == 'true',
        amount:req.body.discountamount,
        expireDate:req.body.discountexpirydate,
        isActive: req.body.active == 'true'
    });

    newDiscount.save(function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/discount');
    });
});

//delete product
router.post('/delete-product', function(req, res, next){
    Product.findByIdAndRemove(req.body.custId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/product');
    });
});

//delete discount code
router.post('/delete-discount', function(req, res, next){
    Discount.findByIdAndRemove(req.body.discountId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/discount');
    });
});

module.exports = router;