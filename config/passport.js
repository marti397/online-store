var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});  

passport.use('local.signup', new LocalStrategy({
        usernameField: 'signUpEmail',
        passwordField: 'signUpPassword',
        passReqToCallback: true
    },
    function(req, signUpEmail, signUpPassword, done) {
      User.findOne({ email: signUpEmail }, function (err, user) {
        if (err) { return done(err); }
        if (user) {
          return done(null, false, { message: 'Email already in use.' });
        }
        var newUser = new User();
        newUser.email = signUpEmail;
        newUser.password = newUser.encryptPassword(signUpPassword);
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
      return done(null, false, { message: 'No se pudo encontrar al usuario' });
    }
    if (!user.validatePassword(signInPassword)) {
        return done(null, false, { message: 'Contrasena incorrecta.' });
    }
    return done(null, user);
  });
}
));