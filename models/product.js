var mongoose = require('mongoose');

// library that uses mongo search to replicate that data from mongo db
// this allows us not to have to write addt'l code to connect us
// to elastic and mongo db
// var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({

 // we are creating a relational database here 
// in order to populate this category field
// it has to be a data type of ObjectId
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
      name: String, 
      price: Number,
      image: String
});


// a plugin for our product schema
// this has special features like Product.seach, Product.mapping
// ProductSchema.plugin(mongoosastic, {
// local host of the elsatic search
  // hosts: [
  // elastic search runs on this server
//     'localhost:9200'

//   ]
// });

 module.exports = mongoose.model('Product', ProductSchema);