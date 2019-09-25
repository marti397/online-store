var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csurf = require('csurf');

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
  res.render('user/signup', { csrfToken: req.csrfToken() });
});

//sigUpPost
router.post('/user/signup', function (req, res, next) {
  res.send('data is being processed')
})

module.exports = router;
