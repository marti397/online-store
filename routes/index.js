var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  var flashMessage = req.flash('success')[0];
  Product.find({}, function(err, docs){
    res.render('shop/index', { title: 'Online Store', products: docs, messages: flashMessage, noMessage: !flashMessage});
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id
  //create a cart object and do a terniary expression of passing an empty object or a cart if it exists
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  Product.findById(productId, function(err, product){
    if (err){return res.redirect('/')};
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/')
  })
});

/* Shopping Cart Page */
router.get('/shopping-cart', function(req, res, next) {
  //res.render('shop/shopping-cart', { products: null});
  if (!req.session.cart){
    return res.render('shop/shopping-cart', { products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice});
});

/* Checkout Page */
router.get('/checkout', function(req, res, next) {
  //res.render('shop/shopping-cart', { products: null});
  if (!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var flashMessage = req.flash('error')[0];
  res.render('shop/checkout', {totalPrice: cart.totalPrice, messages: flashMessage, noError: !flashMessage});
});

//checkout post
router.post('/checkout', function(req, res, next){
  if (!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_zm6Fa5KELRS1ERYX19A7LvXz");
  
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge for jenny.rosen@example.com"
  }, function(err, charge) {
    // asynchronously called
    if (err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    req.flash('success', "tu compra fue exitosa");
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;
