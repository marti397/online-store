var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var Cart = require('../models/cart');
var csrfProtection = csurf({ cookie: true });

var Product = require('../models/product');
var Order = require('../models/order');
var Discount = require('../models/discount');
var User = require('../models/user');

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
  if (!req.session.cart){
    return res.render('shop/shopping-cart', { products: null});
  }
  //discount and final price
  var cart = new Cart(req.session.cart);
  cart.addTax();
  if (cart.discountCodeName){
    cart.addDiscount(cart.isDiscountPercent, cart.discountAmount);
    cart.changeTotalPriceWDiscount(cart.discount);
  }
  cart.getFinalPrice();
  //
  if(req.query.cartdiscount){
    const regex = new RegExp(escapeRegex(req.query.cartdiscount), 'gi');
    Discount.find({code:regex}, function (err, queryResults) {
      if(queryResults.length > 0 && queryResults[0].isActive){
        var currentDate = new Date();
        var expirationDate = new Date(queryResults[0].expireDate);         
        if(currentDate > expirationDate){
          var maquery = { code:regex };
          Discount.findOneAndUpdate(maquery, { isActive: false  }, function(err, doc){
            if (err){return res.redirect('/')};
          });
        };
        cart.changeIsDiscountPercent(queryResults[0].isPercent);
        cart.changeDiscountCodeName(queryResults[0].code);
        cart.addDiscountAmount(queryResults[0].amount);
        cart.addDiscount(queryResults[0].isPercent, queryResults[0].amount);
        cart.changeTotalPriceWDiscount(cart.discount);
        //add tax
        cart.addTax();
        cart.getFinalPrice();
        req.session.cart = cart;
        res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, csrfToken: req.csrfToken(), isdiscount: cart.discountCodeName, discountAmount: cart.discountAmount, discount: cart.discount, isPercent: cart.isDiscountPercent, tax: cart.tax, finalPrice: cart.finalPrice});
      } else{
        req.session.cart = cart;
        res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, csrfToken: req.csrfToken(), isdiscount: cart.discountCodeName, discountAmount: cart.discountAmount, discount: cart.discount, isPercent: cart.isDiscountPercent, tax: cart.tax, finalPrice: cart.finalPrice});
      }
    });
  } else{
    req.session.cart = cart;
    res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, csrfToken: req.csrfToken(), isdiscount: cart.discountCodeName, discountAmount: cart.discountAmount, discount: cart.discount, isPercent: cart.isDiscountPercent, tax: cart.tax, finalPrice: cart.finalPrice});
  }
});

/* Checkout Page */
router.get('/checkout', function(req, res, next) {
  if (!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var flashMessage = req.flash('error')[0];
  res.render('shop/checkout', {finalPrice: cart.finalPrice, messages: flashMessage, noError: !flashMessage, userInfo: req.user});
});

//checkout post
router.post('/checkout', function(req, res, next){
  if (!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_zm6Fa5KELRS1ERYX19A7LvXz");
  
  stripe.charges.create({
    amount: cart.finalPrice * 100,
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
    const purchaseEvent = new Date();
    const dateOptions = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const regexEmail = new RegExp(escapeRegex(req.body.email), 'gi');
    const regexName= new RegExp(escapeRegex(req.body.name), 'gi');
    if(!req.user){
      var myperson = new User({
        email: regexEmail,
        password:"default",
        name: regexName
      });
      req.user = myperson
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
      orderId: Math.floor(Math.random() * 10) + Date.now().toString(),
      orderStatus: "Tu orden está siendo procesada",
      orderDate: purchaseEvent.toLocaleString("en-GB", dateOptions)
    });
    order.save(function(err, result){
      if (err) { return next(err); }
      req.flash('success', "correo: " +  req.user.email + " - confirmación: "  + order.orderId);
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};