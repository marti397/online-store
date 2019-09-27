var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport')

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

router.post('/user/signup', 
  passport.authenticate('local.signup',{failureRedirect: '/user/signup',
    failureFlash: true }),
  function (req, res, next){
    res.redirect('/user/profile')
});

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});

module.exports = router;
