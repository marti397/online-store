var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport')
var { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var csrfProtection = csurf({ cookie: true });

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');

//to use in all routes of the router, but otherwise you can just - app.get('/user/signup', csrfProtection,  -
router.use(csrfProtection);

//location of routes matters for logged in users
router.get('/profile', isLoggedIn, function(req, res, next){
  var flashMessage = req.flash('error');
  var flashMessageSuccess = req.flash('success')[0];
  Order.find({
    user: req.user
  }, function(err, orders){
    if (err){return res.write('Error!');}
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders, userInfo: req.user, csrfToken: req.csrfToken(), messages: flashMessage, goodMessage: flashMessageSuccess});
  });
});

//udpate user
router.post('/update-user', isLoggedIn, [
  //validate fields
  check('name').isLength({ min: 1 }).withMessage('especifica un nombre'),
  check('email').isEmail().withMessage('correo electrónico invalido'),

  //sanitize fields
  sanitizeBody('name').escape(),
  sanitizeBody('email').escape()
  ],function(req, res, next){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var messages = [];
      errors.array().forEach(function(error){
        messages.push(error.msg);
      })
      req.flash('error', messages);
      res.redirect('/user/profile');
    }
    else{
      User.findByIdAndUpdate(req.body.custId, {
        email:req.body.email,
        name:req.body.name
    }, function(err,result){
        if (err) { return next(err); }
        req.flash('success', "tu información se ha guardado!");
        res.redirect('/user/profile');
      });
    }
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});

//the function below I could put the notLoggedIn function for the the routes I want to check the guy is not loggedin
router.use('/', notLoggedIn, function(req, res, next){
  next();
});

router.get('/cuenta', function(req, res, next){
  res.render('user/registerorcreate');
})

router.get('/access', function (req, res, next) {
  var flashMessage = req.flash('error');
  // pass the csrfToken to the view
  res.render('user/access', { csrfToken: req.csrfToken(), messages: flashMessage });
});

router.get('/register', function (req, res, next) {
  var flashMessage = req.flash('error');
  // pass the csrfToken to the view
  res.render('user/register', { csrfToken: req.csrfToken(), messages: flashMessage });
});
  
router.post('/signup', [
  check('signUpEmail').isEmail().withMessage('correo electrónico invalido'),
  check('signUpPassword').isLength({ min: 4 }).withMessage('la contraseña tiene que tener al menos cuatro caracteres'),
  check('fullname').isLength({ min: 1 }).withMessage('el Nombre debe ser especificado'),

  //sanitize fields
  sanitizeBody('fullname').trim().escape(),

  ], function (req, res, next){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var messages = [];
      errors.array().forEach(function(error){
        messages.push(error.msg);
      })
      req.flash('error', messages);
      res.redirect('/user/register');
    }
    else{
      passport.authenticate('local.signup',{
        successRedirect: '/user/profile',
        failureRedirect: '/user/register',
        failureFlash: true })
      (req,res);
    }
});
  
router.post('/signin', [
  check('signInEmail').isEmail().withMessage('correo electrónico invalido'),
  check('signInPassword').isLength({ min: 4 }).withMessage('la contraseña tiene que tener al menos cuatro caracteres')
  ], function (req, res, next){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var messages = [];
      errors.array().forEach(function(error){
        messages.push(error.msg);
      })
      req.flash('error', messages);
      res.redirect('/user/access');
    }
    else{
      passport.authenticate('local.signin',{
        successRedirect: '/user/profile',
        failureRedirect: '/user/access',
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