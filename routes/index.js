var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var Cart = require('../models/cart');
var csrfProtection = csurf({ cookie: true });

var Product = require('../models/product');
var Order = require('../models/order');

//Get main page
router.get('/', function(req, res, next) {
  var flashMessage = req.flash('success')[0];
  res.render('shop/main', { title: 'Online Store', messages: flashMessage, noMessage: !flashMessage});

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
    res.redirect('/product/todo')
  })
});

//reduce by one
router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id
  //create a cart object and do a terniary expression of passing an empty object or a cart if it exists
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

//increase by one
router.get('/increase/:id', function(req, res, next){
  var productId = req.params.id
  //create a cart object and do a terniary expression of passing an empty object or a cart if it exists
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

//remove all
router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id
  //create a cart object and do a terniary expression of passing an empty object or a cart if it exists
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

/* Shopping Cart Page */
router.get('/shopping-cart', csrfProtection, function(req, res, next) {
  //res.render('shop/shopping-cart', { products: null});
  if (!req.session.cart){
    return res.render('shop/shopping-cart', { products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, csrfToken: req.csrfToken()});
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
    currency: "mxn",
    source: req.body.stripeToken, // obtained with Stripe.js
    statement_descriptor: 'Lupita Accesorios Co',
    description: "Charge for " + req.body.name
  }, function(err, charge) {
    // asynchronously called
    if (err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success', "correo: " +  req.user.email + " , confirmación: "  + charge.id);
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;
