var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  /*example mongoose
  var user = User({
  firstname : 'test',
  lastname  : 'test',
  email     : 'test',
  username  : 'test',
  password  : 'test'
	});
  user.save();*/
});



module.exports = router;
