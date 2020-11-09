var express = require('express');
var router = express.Router();
var async = require('async');

var Product = require('../models/product');
var Discount = require('../models/discount');
var Categories = require('../models/category');
var Order = require('../models/order');
var User = require('../models/user');
var Category = require('../models/category');

//Get the main admin page
router.get('/', function(req, res, next) {
    var flashMessage = req.flash('error');
    res.render('user/admin', {messages: flashMessage, noMessage: !flashMessage});
});

//read all products for admin
router.get('/product', function(req, res, next) {
    var flashMessage = req.flash('error');
    async.parallel({
        categories: function(callback) {
            Category.find({},callback);
        },
        products: function(callback){
            Product.find({},callback);
        }
    }, function (err,results){
        res.render('user/admin-product', {data: results, messages: flashMessage, noMessage: !flashMessage});
    });
});

//read all discounts for admin
router.get('/discount', function(req, res, next) {
    var flashMessage = req.flash('error');
    Discount.find({}, function(err, docs){
        res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
      });
});

//read all categories for admin
router.get('/categories', function(req, res, next) {
    var flashMessage = req.flash('error');
    Categories.find({}, function(err, docs){
        res.render('user/admin-categories', {categories: docs, messages: flashMessage, noMessage: !flashMessage});
      });
});

//read all orders for admin
router.get('/order', function(req, res, next) {
    var flashMessage = req.flash('error');
    if (req.query.checkData){
        Order.find({$or:[{orderId:req.query.checkData},{name:req.query.checkData},{orderStatus:req.query.checkData}]},function(err, docs){
            if (err){return res.write('Error!');}
            res.render('user/admin-order', {order: docs});
        })
    }else{
        Order.find({}, function(err, docs){
            res.render('user/admin-order', {order: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    }
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

//update order
router.post('/update-order', function(req, res, next){
    Order.findByIdAndUpdate(req.body.orderId, {
        name:req.body.orderName,
        orderStatus:req.body.orderStatus,
        address:req.body.orderAddress
    }, function(err,result){
        res.redirect('/admin/order');
    });
});

//add product
router.post('/add-product', function(req, res, next){
    var myphotoarr = req.body.myphotofile;
    myphotoarr.forEach(function(item,index,myphotoarr){
        myphotoarr[index] = "/images/products/" + item;
    })
    var newProduct = new Product({
        imagePath: myphotoarr,
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

//add category
router.post('/add-category', function(req, res, next){
    var newCategory = new Categories({
        category: req.body.category
    });

    newCategory.save(function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/categories');
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

//delete category
router.post('/delete-category', function(req, res, next){
    Category.findByIdAndRemove(req.body.categoryId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/categories');
    });
});

module.exports = router;