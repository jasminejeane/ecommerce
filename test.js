
// async controls node.js 's ansynchronis features 
// this allows for code to be controlled in case one function is 
// dependant on another to run
var async = require('async');



// not sure if other function should go here.. but will come back to 
// it if there is an error

  async.waterfall([

  function(callback){

    Category.find({}, function(err, category){
      if (err)
        return next(err);
      // null means there was no error 
      callback(null, category);

    });
  },

  function(category, callback){
    Product.findOne({category: category._id}, function(err, productSingle){

      if (err)
        // are errs printed to the console or on the browser ??
        return next(err);
      callback(null, productSingle);

    });

  },

  function(productSingle, callback){
    Product.findById({ _id: productSingle._id }, function(err, product){
      if (err)
        return next(err);
      res.render('');
      res.redirect('');

    });
   }
  ]);