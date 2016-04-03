var mongoose = require('mongoose');

// a library to hash a password before saved
// to the database
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;




// 1. user schema- usename attributes
// characterisics or fields

//this is so we can store user data like 
// email password photo etc. 
//simple enough

var UserSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  // unique it can only be created one time
  // lowercase converts it to lowercase no matter how 
  // its typed in
  password: String,

  profile: {

      name: {type: String, default:''},
      picture: {type:String, default:''}

  },

  address: String,

  history: [{
    date: Date,
    paid: {type: Number, default: 0},
    item: {type: Schema.Types.ObjectId, ref: ''}

  }]


});




// 2. hash a password before saved to the db


UserSchema.pre('save', function(next){
  var user = this;

  if (!user.isModified('password'))
    return next();
    //is the user document modified
    bcrypt.genSalt(10, function(err, salt) {
      if (err)
        return next(err);
      bcrypt.hash(user.password, salt, null, function(err, hash){
        //null is just saying you don't need to see the 
        // progress of the hash process
        // you can otherwise console log it
        if (err) 
          return next(err);
        user.password = hash;
        // mongo db will actuall save user.password
        // i think from adding next .
        //  like go on to the next thing
        next();
    });
  });
});

//pre is a mongoose method.. 
//it pre saves it before its saved to a database
// you are doing pre so that you can get a new crypted 
// password before we add the password to the db

// what is...
// next
// Next simply allows the next route handler in 
// line to handle the request. In this case, if 
// the user id exists, it will likely use res.send to 
// complete the request.
// 




// 3. new method that will compare to the password
// the user types in the database


UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);

};


// where will we be  using the model name 'User'
module.exports = mongoose.model('User', UserSchema);









