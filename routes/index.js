var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport')
var { check, validationResult } = require('express-validator');

var Product = require('../models/product');

var csrfProtection = csurf({ cookie: true });
//to use in all routes of the router, but otherwise you can just - app.get('/user/signup', csrfProtection,  -
router.use(csrfProtection);


/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({}, function(err, docs){
    res.render('shop/index', { title: 'Online Store', products: docs});
  });
});

//signUpGet
router.get('/user/signup', function (req, res, next) {
  // pass the csrfToken to the view
  var flashMessage = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: flashMessage });
});


//signInGet
router.get('/user/signin', function (req, res, next) {
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

router.post('/user/signup', [
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

router.post('/user/signin', [
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


router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});

module.exports = router;
