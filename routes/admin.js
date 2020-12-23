var express = require('express');
var router = express.Router();
var async = require('async');
var nodemailer = require('nodemailer');

var Product = require('../models/product');
var Discount = require('../models/discount');
var Categories = require('../models/category');
var Order = require('../models/order');
var User = require('../models/user');
var Category = require('../models/category');
var OrderSatus = require('../models/order-status');
var Supplier = require('../models/supplier');
var Style = require('../models/style');

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
        allstyles: function(callback){
            Style.find({},callback)
        },
        supplier: function(callback){
            Supplier.find({},callback);
        },
        products: function(callback){
            if(req.query.nostock){
                Product.find({quantityAvailable:0},callback); //showOnWeb
            }else if(req.query.noshow){
                Product.find({showOnWeb:false},callback);
            }else if(req.query.showsuppliers){
                Product.find({supplier:req.query.showsuppliers}, callback);
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

//read all suppliers for admin
router.get('/supplier', function(req, res, next) {
    var flashMessage = req.flash('error');
    if(req.query.checkData){
        Supplier.find({name:req.query.checkData}, function(err, docs){
            res.render('user/admin-supplier', {supplier: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    }else{
        Supplier.find({}, function(err, docs){
            res.render('user/admin-supplier', {supplier: docs, messages: flashMessage, noMessage: !flashMessage});
        });
    }
    
});

//read all orders for admin
router.get('/order', function(req, res, next) {
    var flashMessage = req.flash('error');
    async.parallel({
        status: function(callback) {
            OrderSatus.find({},callback);
        },
        order: function(callback){
            if(req.query.onlyGuest){
                Order.find({isguest:true}, callback);
            } else if(req.query.onlyUsers){
                Order.find({isguest:false}, callback);
            } else if(req.query.onlyProcessing){
                Order.find({orderStatus:"processing"}, callback);
            } else if (req.query.checkData){
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

//read all styles for admin
router.get('/style', function(req, res, next) {
    var flashMessage = req.flash('error');
    Style.find({}, function(err, docs){
        res.render('user/admin-style', {productStyle: docs, messages: flashMessage, noMessage: !flashMessage});
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
    if(req.body.myphotofileupdate){
        myphotoarr = req.body.myphotofileupdate;
        myphotoarr.forEach(function(item,index,myphotoarr){
            myphotoarr[index] = "/images/products/" + item;
        })
    }else{
        myphotoarr = req.body.hiddenimagePath.split(",");
    }
    Product.findByIdAndUpdate(req.body.custId, {
        imagePath:myphotoarr,
        title:req.body.title,
        descr:req.body.descr,
        details:req.body.details,
        price:req.body.price,
        type:req.body.type,
        style:req.body.style,
        quantityAvailable:req.body.quantity,
        showOnWeb:showOnWeb,
        supplier:req.body.supplier,
        trueprice:req.body.trueprice
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
        if(result.orderStatus != req.body.orderStatus){
            //email confimartion
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'chris.m.servin@gmail.com',
                    pass: 'Notredame10!'
                }
            });
          
            var mailOptions = {
                from: 'chris.m.servin@gmail.com',
                to: req.body.email,
                subject: 'glammy order update',
                text: 'the status of your order has been updated: ' + req.body.orderStatus + '. You can check your order details here: http://localhost:3000/info/' + result.orderId + '/details'
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
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

//update supplier
router.post('/update-supplier', function(req, res, next){
    if(req.body.myphotofileupdate){
        myphoto = "/images/suppliers/" + req.body.myphotofileupdate;
    }else{
        myphoto = req.body.hiddenPhoto;
    }    
    Supplier.findByIdAndUpdate(req.body.supplierId, {
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        comments:req.body.comments,
        photo:myphoto
    }, function(err,result){
        res.redirect('/admin/supplier');
    });
});

//add product
router.post('/add-product', function(req, res, next){
    truePrice = req.body.trueprice;
    if (req.body.currency == "yuan"){
        truePrice = req.body.trueprice * 0.15 ;//exchange rate Nov 21, 2020
    }
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
        showOnWeb:showOnWeb,
        supplier:req.body.supplier,
        trueprice:truePrice
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

//add new supplier
router.post('/add-supplier', function(req, res, next){
    myphoto = "/images/suppliers/" + req.body.myphotofile;
    var newSupplier = new Supplier({
        name:req.body.name,
        address:req.body.address,
        photo:myphoto,
        email:req.body.email,
        comments:req.body.comments
    });
    newSupplier.save(function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/supplier');
    });
});

//add style
router.post('/add-style', function(req, res, next){
    var newStyle = new Style({
        style: req.body.style
    });
    newStyle.save(function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/style');
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

//delete supplier
router.post('/delete-supplier', function(req, res, next){
    Supplier.findByIdAndRemove(req.body.supplierId,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/supplier');
    });
});

//delete style
router.post('/delete-style', function(req, res, next){
    Style.findByIdAndRemove(req.body.style,function(err,result){
        if (err) return console.error(err);
        res.redirect('/admin/style');
    });
});

module.exports = router;

function isLoggedInAdmin(req, res, next){
    if (req.isAuthenticated() && (req.user.isadmin == true)){
      return next();
    }
    res.redirect('/');
}