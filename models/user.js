var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  
  firstname : String,
  lastname  : String,
  email     : String,
  username  : String,
  password  : String,
  nodes : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }]
});

module.exports = mongoose.model('User', UserSchema, 'User');