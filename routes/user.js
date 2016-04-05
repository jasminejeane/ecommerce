// this will be handling all of our user routes
// login, logout, signup, profile

var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
// to use a passport built in function
var passportConf = require('../config/passport');
var async = require('async');



router.get('/login', function(req, res){
// serialize allows you to use this syntax req.user req.something
// when we serialize we store the session in the temporary data store connect mongo
// then we deserialize and get the data where we get this synax we can use over and over
// i beleive serialize is encryting the session data so that when 
// it travels across browsers the information is not exposed 
  if (req.user) 
    // why do we return redirect here why isn't it
  // just res.redirect
    return res.redirect('/');
    // this is referring to the flash message created
    // on the passport configuration
  res.render('accounts/login', {message: req.flash('loginMessage')});

});


router.post('/login', passport.authenticate('local-login', {
 // second paramenter, three objects that you have to use for password authenticate

  successRedirect: '/profile',
  failureRedirect: '/login',
  // we are reinabling the flash message here so that the 
  // get page can recieve the failure flash otherwise it 
  // seems it might not do it again
  failureFlash: true
}));


router.get('/profile', function(req, res, next){
  User.findOne({ _id: req.user._id}, function(err, user){
    if (err) 
      return next(err);
    res.render('accounts/profile', { user: user});

  });
});



router.get('/signup', function(req, res, next){

// this might provide info about second argument
// http://webapplog.com/url-parameters-and-routing-in-express-js/
  res.render('accounts/signup', {

// where did we define errors
      // i believe errors are defined below in the post signup route 
    errors: req.flash('errors')
  });

});


router.post('/signup', function(req, res, next){

  async.waterfall([

    function(callback){

      var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.profile.picture = user.gravatar();

  User.findOne({email: req.body.email }, function(err, existingUser){
    if (existingUser){
      // i believe errors are defined here related to signup get above
        req.flash('errors', 'Account with that email address already exists');
        return res.redirect('/signup');
      }
      else {

      user.save(function (err, user){

        if (err) return next(err);
        callback(null, user);


      });
     } 
    });
  },
// 49s
    function(user) {
      var cart = new Cart();
      cart.owner = user._id;
      cart.save(function(err){
       if (err) return next(err);
    // logIn is a function thats adding a session to
    // the server and a cookie to the browser
    // simply redirecting wouldn't store the session/cookie
       req.logIn(user, function(err){
        if (err) return next(err);
       res.redirect('/profile');
      });
     });
    }
   ]);

  




router.get('/logout', function(req, res, next){
// this is it for logout. It seems to apparently already
// be an embedded function.
// its saying logout of current request
  req.logout();
  res.redirect('/');

});

router.get('/edit-profile', function(req, res, next){
  res.render('accounts/edit-profile', {message: req.flash('success')});

});


router.post('/edit-profile', function(req, res, next){
  //  User.findOne is finding by id the user that is currently logged in
  User.findOne({_id: req.user._id}, function(err, user){

    if (err) 
      return next(err);

    // if input text has name or address 
    // replace the data in the db with what you type in
    // so (req.body.name) is the input field and we are making that =
    // user.profile.name
    if (req.body.name) 
      user.profile.name =req.body.name;
    if (req.body.address) 
      user.address = req.body.address;



    // savethe users data and..
    // store the flash in a session ??/
    //  the flash success is connected with other routes that have
    // success named in that routes
    // need to read more about flash
    user.save(function(err){
      if (err) 
        return next(err);

      req.flash('success', 'Successfully Edited your profile');
      return res.redirect('/edit-profile');
    });
  });
});


module.exports = router;





