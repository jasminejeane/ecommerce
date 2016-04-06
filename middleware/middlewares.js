// we are separating this middleware bc it is going to be a little longer
// than the other middlewares

var Cart = require('../models/cart');


module.exports = function (req, res, next){

  if (req.user){
   var total = 0;
   Cart.findOne({ owner: req.user._id}, function(err, cart){
    if(cart){
      for (var i = 0; i < cart.items.length; i++) {
        total += cart.items[i].quantity;
      }
    }


   })

  }



};
