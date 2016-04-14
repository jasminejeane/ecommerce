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


// CP - need further breakdown of this code

router.post('/search', function(req, res, next){
  console.log(req.body.search_term);
  Product.search({
    query_string: {query: req.body.search_term }
  }, function(err, results) {
      if (err) return next(err); 
      res.json(results);
 });
});


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

      var accessories = ['/images/accessories/ac1.jpeg','/images/accessories/ac2.jpeg','/images/accessories/ac3.jpeg',   
      '/images/accessories/ac4.jpeg','/images/accessories/ac5.jpeg','/images/accessories/ac6.jpeg','/images/accessories/ac7.jpeg',
      '/images/accessories/ac8.jpeg','/images/accessories/ac9.jpeg','/images/accessories/ac10.jpeg','/images/accessories/ac11.jpeg',
      '/images/accessories/ac12.jpeg','/images/accessories/ac13.jpeg','/images/accessories/ac14.jpeg','/images/accessories/ac15.jpeg'
      ];
      var images = ['/images/fit1.jpeg','/images/fit2.jpeg','/images/fit3.jpeg','/images/fit4.jpeg','/images/fit5.jpeg',
       '/images/fit6.jpeg','/images/fit7.jpeg','/images/fit8.jpeg','/images/fit9.jpeg','/images/fit10.jpeg','/images/fit11.jpeg',
      '/images/fit12.jpeg','/images/fit13.jpeg','/images/fit14.jpeg','/images/fit15.jpeg','/images/fit16.jpeg', '/images/fit17.jpeg',
      '/images/fit18.jpeg','/images/fit19.jpeg','/images/fit20.jpeg','/images/fit21.jpeg','/images/fit22.jpeg','/images/fit23.jpeg',
      '/images/fit24.jpeg','/images/fit25.jpeg','/images/fit26.jpeg','/images/fit27.jpeg','/images/fit28.jpeg','/images/fit29.jpeg',
      '/images/fit30.jpeg'];

     
    for (var i =0; i < 15; i++){

      var product = new Product();
     
      product.category = category._id;
      // faker gives you fake data
      // we are using faker methods commerce. product name etc.
      // to get fake data w/o having to do it ourself!!!
      product.name = faker.commerce.productName();
      product.price = faker.commerce.price();

      product.image = images[i];

      product.save();

    }
  }
  ]);

  res.json({ message: 'Success'});
});




module.exports = router;

