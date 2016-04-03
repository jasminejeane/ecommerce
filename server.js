var express = require('express');
//logs rquests and errors in the terminal and the amount 
//of time it  takes to get that page
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
// session id is an encryption signature
// session is stored on the server
// session doesn't persist after browser is closed 
var cookieParser = require('cookie-parser');
// users cookies to store a session id in a users browser
// on value cookie to retrieve information stored on the server 
// server side storage
// cookies store on the visitors browser
// cookies has sessions encryted in their cookies
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);
// this is the db for storing the session
// this will be saved into mongo db 
// mongo store is specifically to store sessions on the server side
// mongo store library is depending on expression session
// we need to know that a session will be based on an express
// session library
var passport = require('passport');

// oauth login support

var secret =require('./config/secret');
var User = require('./models/user');

// config files store database information 
// passport is a library for authentication

var app = express();


// connect mongoose to the db
//  'mongodb://...' is a path to the database
// what went here instead of this?
// we studued just a path to the local host and maybe a route 
// connection

mongoose.connect(secret.database, function(err){

  if (err) {

    console.log(err);
  }
  else{
    console.log("Connected to the Database");
  }

});

// middleware.. almost everything you require 
// you have to use
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({

  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({url: secret.database, autoReconnect: true})
}));

// flash is dependent on session and cookie
app.use(flash());
app.use(passport.initialize());
// acts as a middleware to alter the req object
// and change the user value that is currently the session id
// from the client cookie into the true deserialized user object

app.use(passport.session());

// this function below will have every user able to
// have the user object by default in every route
// without having to specify the object in every route
// why did we not use the universal /* here 
app.use(function(req, res, next){

// whats does locals mean- local variable
// user is the name of the object you want to use
  res.locals.user = req.user;
  next();
});


// to see the value of the cookie
app.get('/*', function(req, res, next){

  if(typeof req.cookies['connet.sid'] !== 'undefined'){

    console.log(req.cookies['connect.sid']);
  }

  next();
});




app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);





app.listen(secret.port, function(err) {

  if (err) throw err;
  console.log("Server is Running on Port" + secret.port);
});














