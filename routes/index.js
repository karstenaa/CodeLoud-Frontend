var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Node = require('../models/node');
var Usage = require('../models/usage');
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

/* GET log in page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
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

/* GET register page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
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
