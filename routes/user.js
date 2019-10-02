var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport')
var { check, validationResult } = require('express-validator');
var csrfProtection = csurf({ cookie: true });

var Order = require('../models/order');
var Cart = require('../models/cart');

//to use in all routes of the router, but otherwise you can just - app.get('/user/signup', csrfProtection,  -
router.use(csrfProtection);

//location of routes matters for logged in users
router.get('/profile', isLoggedIn, function(req, res, next){
  Order.find({
    user: req.user
  }, function(err, orders){
    if (err){return res.write('Error!');}
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders});
  });
  
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});

//the function below I could put the notLoggedIn function for the the routes I want to check the guy is not loggedin
router.use('/', notLoggedIn, function(req, res, next){
  next();
});

//signUpGet
router.get('/signup', function (req, res, next) {
  // pass the csrfToken to the view
  var flashMessage = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: flashMessage });
});

//signInGet
router.get('/signin', function (req, res, next) {
  // pass the csrfToken to the view
  var flashMessage = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: flashMessage });
});
  
/*router.post('/user/signup', 
  passport.authenticate('local.signup',{failureRedirect: '/user/signup',
      failureFlash: true }),
    function (req, res, next){
      res.redirect('/user/profile')
});*/
  
router.post('/signup', [
  check('signUpEmail').isEmail().withMessage('email invalido'),
  check('signUpPassword').isLength({ min: 4 }).withMessage('must be at least 4 chars long')
  ], function (req, res, next){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var messages = [];
      errors.array().forEach(function(error){
        messages.push(error.msg);
      })
      req.flash('error', messages);
      res.redirect('/user/signup');
    }
    else{
      passport.authenticate('local.signup',{
        successRedirect: '/user/profile',
        failureRedirect: '/user/signup',
        failureFlash: true })
      (req,res);
    }
});
  
router.post('/signin', [
  check('signInEmail').isEmail().withMessage('email invalido'),
  check('signInPassword').isLength({ min: 4 }).withMessage('must be at least 4 chars long')
  ], function (req, res, next){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var messages = [];
      errors.array().forEach(function(error){
        messages.push(error.msg);
      })
      req.flash('error', messages);
      res.redirect('/user/signin');
    }
    else{
      passport.authenticate('local.signin',{
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true })
      (req,res);
    }
});

module.exports = router;

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}