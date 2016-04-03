// we will be using the passport library
 // in our login in route

 var passport = require('passport');
 // passport is for the authentication
 // we had to require passport here as a sort of configuration ?? :/
 var LocalStrategy = require('passport-local').Strategy;
 // this has to do with local login
 var User = require('../models/user');



 // 1. serialize and deserialize

 // break down of serialize most before 12:07
// serialization is the process of transforming data structure or 
// object state in a format that can be stored bin connect mongo

// like the user object needs to be stored in connect mongo
// the whole objet is retrieved with the help of the key
 
 passport.serializeUser(function(user, done){
  done(null, user._id);
  // mongo db comes up with a self generated _id for the 
  // user .. we don't have to add it to the schema

 });

passport.deserializeUser(function(id, done){
  // This looks like the first time the User model name
  // was called
  User.findById(id, function(err, user){

    done(err, user);

  });

});

 // 2. middle that processes the login mechanism

// local-login is the middlewares name so you can refer
// to it at a login route later on
// then.. we arre creating a new anonymous instance of the Local Strategy object
// then we are passing it the required fields
// by default Local Strategy uses the username and password field
// but we are overriding it when we put email
passport.use('local-login', new LocalStrategy({

  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true

},

// what does null mean in this call back
// it seems to mean nothing is wrong

// for cb done could be anything likes next but for login in we should 
// use done and for routes we should use next
function(req, email, password, done){
// could be findById as well
  User.findOne({ email: email}, function(err, user){
    if (err) 
      return done(err);
    if (!user) {
      return done(null, false, req.flash('loginMessage',
        'No user has been found'));
    }
    // using function made on the User model page
    if (!user.comparePassword(password)){

      return done(null, false, req.flash('loginMessage',
        'Oops Wrong Password Friend!'));
    }
    return done(null, user);
    });
  }));


 // 3. custom function that will validated if a user 
 // is logged in or not

 exports.isAuthenticated = function(req, res, next){
  if (req.isAuthenticated()){
    // this means go to the next cb 
    // allows the user to access the next route
    return next();
  }
  res.redirect('/login');
 };






// module.exports = 










