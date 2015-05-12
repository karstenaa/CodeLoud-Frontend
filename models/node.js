var mongoose = require("mongoose");

var NodeSchema = new mongoose.Schema({
  name		: String,
  cpu 		: Number,
  ram 		: Number,
  status    : Boolean,
  stdin  	: String,
  stdout  	: String,
  stderr	: String,
  url		: String,
  usages : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usage' }]
});

module.exports = mongoose.model('Node', NodeSchema, 'Node');