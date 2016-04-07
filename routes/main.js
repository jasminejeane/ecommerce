// this will be handling all of our main routes
// like home, product, search, cart

var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
// it seems like category would need to be required too
var Cart = require('../models/cart');
var async = require('async');
// the key below is the test key
var stripe = require('stripe') ('sk_test_ZBiXT7qOHzxoxqnYurIiYW8t');

function paginate(req, res, next){
  var perPage = 9;
    var page = req.params.page;

    Product
      .find()
      // this will allow it to be 9 multiplied by the page #
      // so if you are on page 3 you would have 'skipped' 27 documents
      .skip(perPage * page)
      // this is being sure that those 9 are limited to a page
      // so the above is reading.. skip x amount of documents 
      // and limit 9 documents to 1 query 
      .limit(perPage)
      .populate('category')

      .exec(function(err, products){
        if (err) return next(err);
        // this is counting how many documents we have in the database
        // we are doing this so that we can count how many
        // documents we have and divide them per page
        // then we will see at the bottom of the page how many pages
        // we will have
        Product.count().exec(function(err, count){
          if (err) return next(err);
          res.render('main/product-main', {
            products: products,
            pages: count / perPage
          });
        });
      });    

}


// This created a bridge between product db and elsatic search 
Product.createMapping(function(err, mapping){

  if (err){
    console.log("error creating mapping");
    console.log(err);
  }
  else
  {
    console.log("Mapping created");
    console.log(mapping);
  }
});


// this replicates all of the data and puts it in elastic search
var stream = Product.synchronize();
var count = 0;

// this counts the amount of documents we have 
stream.on('data', function(){
  count ++;
});

// this closes the synchronize and console logs the 
// amount of docs we have all together
stream.on('close', function(){
  console.log("Indexed " + count + " documents");
});


// shows to the user the errors we may have had while
// counting the amount of documents
stream.on('error', function(err){
    console.log(err);
});


// cart route
router.get('/cart', function(req, res, next){
    Cart
      .findOne({ owner: req.user._id })
      // this is where we get the img name, product, price & product
      .populate('items.item') 
      .exec(function(err, foundCart) {
        console.log("found cart is", foundCart);
        if (err) return next(err);
        res.render('main/cart', {
          foundCart: foundCart,
          // just added 
          message: req.flash('remove')

       });
      });
    });

// this is a single product page for purchasing a product
// 51
router.post('/product/:product_id', function(req, res, next){
  Cart.findOne({ owner: req.user._id}, function(err, cart){
    cart.items.push({
      item: req.body["product._id"], //look for product_id
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
      
      cart.save(function(err){
        if (err) return next(err);
        return res.redirect('/cart');
    });
  });
});

// 56
router.post('/remove', function(req, res, next){
    Cart.findOne({ owner: req.user._id}, function(err, cart){
      foundCart.items.pull(String(req.body.item));
      foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
      foundCart.save(function(err, found){
       if (err) return next(err);
       req.flash('remove', 'Successfully removed');
       res.redirect('/cart');
    });
  });
});

// go to this (/search) route and pass the 
// message along with you (req.body.q)
// im thinking (req.body.q) is the body of the 
// search input
router.post('/search', function(req, res, next){
  res.redirect('/search?q=' + req.body.q);
});

// the only way to retrieve the data from the post
 // is through  (req.query.q) and we need 
// the added (?q=) on the search to use (req.query.q)
// (/search?q=pizza) would result in (req.query.pizza)
router.get('/search', function(req, res, next){
if (req.query.q){

  // this will search the elastic query replica set
  // for the value submitted
  Product.search({
    query_string: { query: req.query.q }
  }, function(err, results){
    if (err) return next(err);
    // the data will be returned in a nested object with hits
    // immbedding inside hits with source as a key
    // we want the content of source 
    // so we use the map javascript function to cut through
    // the hits objects and resturn _source
    var data = results.hits.hits.map(function(hit){
      // i think the argument hit is the _source
      return hit;
      });
      res.render('main/search-result', {
        // don't entirely know what this is 
        // doing .. it looks like an ajax call
        query: req.query.q,
        data: data

      });
    });
   }
 });


router.get('/', function(req, res, next){

  // the if else is validation if its the user logged in they will get 
  // a different page than if its someone just visiting the page
// belows if statement is a 'pagination' - skip and limit help with the 
// pagination
  if (req.user){
    paginate(req, res, next);

  } else {
  res.render('main/home');
}
});

router.get('/page/:page', function(req, res, next){
    paginate(req, res, next);
});

router.get('/about', function(req, res){

  res.render('main/about');

});


// req.params and :id are related
// I beleive it is the route requested first
// req.params.id allows you to access the parameter 
// in the routes
router.get('/products/:id', function(req, res){
  Product
    .find({category: req.params.id})
    // you can only use populate if the data type is
    // an object id
    // populate is to get all the data 
    // in the category itself
    // now we can get all of the data an present it to our
    // category page like (products.category.name)
    .populate('category')
    // exec is execute an anonyomus funtion on all of these 
    // methods. If it were only one method we could 
    // attach the function that way. but since there are several
    // we have to use exec
    .exec(function(err, products, next){
      if (err) return next(err);
      res.render('main/category', {
        products: products
      });
    });
  });



router.get('/product/:id', function(req, res, next){
  Product.findById({_id: req.params.id}, function(err, product){

      if (err) return next(err);
      res.render('main/product', {
        product: product
      });
    });
  });


// payment route

// for test payment cc info 
// go to https://stripe.com/docs/testing
// scroll down to --Which card numbers should I use for testing?

router.post('/payment', function(req, res, next) {

// we are getting stripe token on the client side bc we are using req.body
  var stripeToken = req.body.stripeToken;
  // this is the total price of your cart
  // we are * by 100 bc stripe is made in cents
  var currentCharges = Math.round(req.body.stripeMoney * 100);
  // everything before .then is a stripe method to create a customer
  // you can see which user who bouht your items with this function
  stripe.customers.create({
    source: stripeToken,
      // this is using a promise.. after the code above runs then it 
    // will run the next code
  }).then(function(customer) {
    // this is all the information so that you can charge the customer
    return stripe.charges.create({
      // this is connected to currentCharges above
      amount: currentCharges,
      currency: 'usd',
      customer: customer.id
    });
  }).then(function(charge) {
    async.waterfall([
      // we are searching the cart owner and once we have found the 
      // cart we want to pass it to a second function
      // so we use callback
      function(callback) {
        Cart.findOne({ owner: req.user._id }, function(err, cart) {
          callback(err, cart);
        });
      },
      function(cart, callback) {
        // this is checking to see if the login user information
        // exist or not
        User.findOne({ _id: req.user._id }, function(err, user) {
          // if the user exists...
          if (user) {
            for (var i = 0; i < cart.items.length; i++) {
              // we are pushing the entire cart.. looping  items and 
              // price one by one  and pushing it to the user history
              user.history.push({ 
                item: cart.items[i].item,
                paid: cart.items[i].price
              });
            }
            // then when we finish the looping we want to save
            // then if no errors we want ot pass it to the 
            // next function
            user.save(function(err, user) {
              if (err) return next(err);
              callback(err, user);
            });
          }
        });
      },
      function(user) {
        // this will check for the newly updated user
        // $set is like cart.items = []
        // then reset the total price to $0
        Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
          if (updated) {
            res.redirect('/profile');
          }
        });
      }
    ]);
  });
});


module.exports = router;