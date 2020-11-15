var express = require('express');
var router = express.Router();
var async = require('async');

var Product = require('../models/product');
var Discount = require('../models/discount');
var Categories = require('../models/category');
var Order = require('../models/order');
var User = require('../models/user');
var Category = require('../models/category');
var OrderSatus = require('../models/order-status');


//protect all routes below
router.use('/', isLoggedInAdmin, function(req, res, next){
    next();
});

//Get the main admin page
router.get('/', function(req, res, next) {
    var flashMessage = req.flash('error');
    res.render('user/admin', {messages: flashMessage, noMessage: !flashMessage, userInfo: req.user});
});

//read all products for admin
router.get('/product', function(req, res, next) {
    var flashMessage = req.flash('error');
    async.parallel({
        categories: function(callback) {
            Category.find({},callback);
        },
        products: function(callback){
            if(req.query.nostock){
                Product.find({quantityAvailable:0},callback); //showOnWeb
            }else if(req.query.noshow){
                Product.find({showOnWeb:false},callback);
            }else if(req.query.yesshow){
                Product.find({showOnWeb:true},callback);
            }else if(req.query.checkData){
                var search = req.query.checkData;
                Product.find({$or:[{title:search},{type:search},{style:search}]},callback);
            }else{
                Product.find({},callback);
            }
        }
    }, function (err,results){
        res.render('user/admin-product', {data: results, messages: flashMessage, noMessage: !flashMessage});
    });
});

//read all discounts for admin
router.get('/discount', function(req, res, next) {
    var flashMessage = req.flash('error');
    if(req.query.onlyPercentage){
        Discount.find({isPercent:true}, function(err, docs){
            res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    }else if(req.query.onlyDollar){
        Discount.find({isPercent:false}, function(err, docs){
            res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    }else if(req.query.onlyActive){
        Discount.find({isActive:true}, function(err, docs){
            res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    } else if(req.query.checkDiscount){
        var search = req.query.checkDiscount;
        Discount.find({code:search}, function(err, docs){
            res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    } else{
        Discount.find({}, function(err, docs){
            res.render('user/admin-discount', {discounts: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    }
});

//read all product categories for admin
router.get('/categories', function(req, res, next) {
    var flashMessage = req.flash('error');
    Categories.find({}, function(err, docs){
        res.render('user/admin-categories', {categories: docs, messages: flashMessage, noMessage: !flashMessage});
      });
});

//read all orders for admin
router.get('/order', function(req, res, next) {
    var flashMessage = req.flash('error');
    async.parallel({
        status: function(callback) {
            OrderSatus.find({},callback);
        },
        order: function(callback){
            if (req.query.checkData){
                async.waterfall([
                    function(callback){
                        User.find({email:req.query.checkData}, function(err,docs){
                            if(docs.length > 0){
                                callback(null, docs[0].id);
                            }else{
                                callback(null, 0);
                            }
                            
                        });
                    }
                ],function (err, result) {
                    if(result == 0){
                        Order.find({$or:[{orderId:req.query.checkData},{name:req.query.checkData},{orderStatus:req.query.checkData},{email:req.query.checkData}]},callback);
                    }else{
                        Order.find({$or:[{orderId:req.query.checkData},{name:req.query.checkData},{orderStatus:req.query.checkData},{user:result}]},callback);
                    }  
                });
            } else{
                Order.find({},callback);
            }
        }
    },function (err,results){
        res.render('user/admin-order', {data: results, messages: flashMessage, noMessage: !flashMessage});
    })
});

//read all users for admin
router.get('/users', function(req, res, next) {
    var flashMessage = req.flash('error');
    if(req.query.onlyAdmin){
        User.find({isadmin:true}, function(err, docs){
            res.render('user/admin-user', {users: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    } else if(req.query.checkData){
        var search = req.query.checkData;
        User.find({$or:[{email:search},{name:search}]}, function(err,docs){
            res.render('user/admin-user', {users: docs, messages: flashMessage, noMessage: !flashMessage});
        })
    }else{
        User.find({}, function(err, docs){
            res.render('user/admin-user', {users: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    } 
});

//read all order categories for admin
router.get('/order-status', function(req, res, next) {
    var flashMessage = req.flash('error');
    OrderSatus.find({}, function(err, docs){
        res.render('user/admin-order-status', {orderStatus: docs, messages: flashMessage, noMessage: !flashMessage});
      });
});

//update products
router.post('/update-product', function(req, res, next){
    var showOnWeb = true;
    var quantityOfProducts = req.body.quantity;
    if(req.body.showProduct==undefined){
        showOnWeb = false;
    }
    if(quantityOfProducts == 0){
        showOnWeb = false;
    }
    Product.findByIdAndUpdate(req.body.custId, {
        title:req.body.title,
        descr:req.body.descr,
        details:req.body.details,
        price:req.body.price,
        type:req.body.type,
        style:req.body.style,
        quantityAvailable:req.body.quantity,
        showOnWeb:showOnWeb
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
        address:req.body.orderAddress,
        email:req.body.email,
        comments:req.body.comments
    }, function(err,result){
        res.redirect('/admin/order');
    });
});

//update user
router.post('/update-user', function(req, res, next){
    isUserAdmin = false;
    if(req.body.isadmin == "true"){
        isUserAdmin = true;
    }
    User.findByIdAndUpdate(req.body.userId, {
        name:req.body.username,
        email:req.body.useremail,
        isadmin:isUserAdmin
    }, function(err,result){
        res.redirect('/admin/users');
    });
});

//add product
router.post('/add-product', function(req, res, next){
    var myphotoarr = req.body.myphotofile;
    myphotoarr.forEach(function(item,index,myphotoarr){
        myphotoarr[index] = "/images/products/" + item;
    })
    var showOnWeb = true;
    var quantityOfProducts = req.body.quantity;
    if(req.body.showProduct==undefined){
        var showOnWeb = false;
    }
    if(quantityOfProducts == 0){
        showOnWeb = false;
    }
    var newProduct = new Product({
        imagePath: myphotoarr,
        title:req.body.title,
        descr:req.body.descr,
        details:req.body.details,
        price:req.body.price,
        type:req.body.type,
        style:req.body.style,
        quantityAvailable:req.body.quantity,
        showOnWeb:showOnWeb
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

//add order status
router.post('/add-order-status', function(req, res, next){
    var newOrderStatus = new OrderSatus({
        status: req.body.orderStatus
    });
    newOrderStatus.save(function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/order-status');
    });
});

//delete product
router.post('/delete-product', function(req, res, next){
    Product.findByIdAndRemove(req.body.custId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/product');
    });
});

//delete order
router.post('/delete-order', function(req, res, next){
    Order.findByIdAndRemove(req.body.custId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/order');
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

//delete order status
router.post('/delete-order-status', function(req, res, next){
    OrderSatus.findByIdAndRemove(req.body.orderStatusId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/order-status');
    });
});

//delete user
router.post('/delete-user', function(req, res, next){
    User.findByIdAndRemove(req.body.userId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/users');
    });
});

module.exports = router;

function isLoggedInAdmin(req, res, next){
    if (req.isAuthenticated() && (req.user.isadmin == true)){
      return next();
    }
    res.redirect('/');
}