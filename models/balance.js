var mongoose = require("mongoose");

var BalanceSchema = new mongoose.Schema({
	username : String,
	balance	: Number,
	last_payment : Date
});

module.exports = mongoose.model('Balance', BalanceSchema, 'Balance');
