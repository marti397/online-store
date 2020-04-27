var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');//express sessions
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);//store session in mongoDB

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var productRouter = require('./routes/product');
var adminRouter = require('./routes/admin');
var miscRouter = require('./routes/misc');
var ocasionRouter = require('./routes/ocasion');

var app = express();

mongoose.connect('mongodb://chrm11:chrm11@ds157559.mlab.com:57559/online-store-db', {useNewUrlParser: true, useUnifiedTopology: true});
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layout', extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'OnlineStoreSecret',
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection
    //ttl: 14 * 24 * 60 * 60, // = tme to live 14 days. Default
    //autoRemove: 'interval',
    //autoRemoveInterval: 10 // In minutes. Default
  }),
  cookie: {maxAge: 180 * 60 * 1000},
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//setting a global variable
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session; // you create a variable accesible via the views by res.locals."name of the variable"
  next();
})

app.use('/ocasiones', ocasionRouter);
app.use('/info', miscRouter);
app.use('/admin', adminRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;