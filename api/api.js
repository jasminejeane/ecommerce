var router = require('express').Router();
var async = require('async');
var faker = require('faker');

var Category = require('../models/category');
var Product = require('../models/product');
// i think we will need product on server page
// going to wait and see for that



// I wonder if all of this can be done
// differently in a seed.js file
// I'm going to check homeward and a couple other sources
// to find out


// :name would be the name you type in the route
// this is specifically related to category
// so the :name types there will replace the content
// of eq.params.name in the function below

router.get('/:name', function(req, res, next){

  async.waterfall([

  function(callback){
    Category.findOne({name: req.params.name}, function(err, category){
      if (err)
        return next(err);
      // null means there was no error 
      callback(null, category);

   });
  },


// category is passed here so that the function knows
// that the id on product.category is refering to the 
// category retrieved above
  function(category, callback){
    for (var i =0; i < 30; i++){
      var product = new Product();
      product.category = category._id;
      // faker gives you fake data
      // we are using faker methods commerce. product name etc.
      // to get fake data w/o having to do it ourself!!!
      product.name = faker.commerce.productName();
      product.price = faker.commerce.price();
      product.image = faker.image.image();

      product.save();

    }
  }
  ]);

  res.json({ message: 'Success'});
});




module.exports = router;

