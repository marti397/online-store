var passport = require('passport'); //passport for authentication
var User = require('../models/user'); //user model
var LocalStrategy = require('passport-local').Strategy; //local strategy by passport

//credentials used to authenticate a user will only be transmitted during the login request.
//if authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});  

//signup strategy. validation is done at the user.js router
passport.use('local.signup', new LocalStrategy({
        usernameField: 'signUpEmail',
        passwordField: 'signUpPassword',
        passReqToCallback: true
    },
    function(req, signUpEmail, signUpPassword, done) {
      User.findOne({ email: signUpEmail }, function (err, user) {
        if (err) { return done(err); }
        if (user) {
          return done(null, false, { message: 'the email is already in use' });
        }
        var newUser = new User();
        newUser.email = signUpEmail;
        newUser.password = newUser.encryptPassword(signUpPassword);
        newUser.name = req.body.fullname;
        newUser.save(function(err, result){
            if (err) { return done(err); }
            return done(null, newUser);
        });
      });
    }
));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'signInEmail',
    passwordField: 'signInPassword',
    passReqToCallback: true
},
function(req, signInEmail, signInPassword, done) {
  User.findOne({ email: signInEmail }, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'the email is not registered' });
    }
    if (!user.validatePassword(signInPassword)) {
        return done(null, false, { message: 'wrong password' });
    }
    return done(null, user);
  });
}
));