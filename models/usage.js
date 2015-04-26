var mongoose = require("mongoose");

var UsageSchema = new mongoose.Schema({
	cpu : Number,
	ram	: Number
});
module.exports = mongoose.model('Usage', UsageSchema);