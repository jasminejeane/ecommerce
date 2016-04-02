var express = require('express');
//logs rquests and errors in the terminal and the amount 
//of time it  takes to get that page
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
// var session = require('session');
// session id is an encryption signature
// var cookieParser = require('cookie-parser');
// users cookies to store a session id in a users browser
//  on value cookie to retrieve information stored on the server 
// var flash = require('express-flash');

var app = express();

var User = require('./models/user');
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');



// connect mongoose to the db
//  'mongodb://...' is a path to the database
// what went here instead of this?
// we studued just a path to the local host and maybe a route 
// connection

mongoose.connect('mongodb://ecom:abc123@ds011790.mlab.com:11790/ecommerce', function(err){

  if (err) {

    console.log(err);
  }
  else{
    console.log("Connected to the Database");
  }

});

// middleware.. yosu need a middleware to run morgan
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(mainRoutes);
app.use(userRoutes);


app.engine('ejs', engine);
app.set('view engine', 'ejs');









app.listen(3000, function(err) {

  if (err) throw err;
  console.log("Server is Running on Port 3000");
});














