var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var session = require('express-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Node = require('../models/node');
var Usage = require('../models/usage');

express.use(session{secret: "secretdude"});
express.use(passport.initialize());
express.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  //fetch data here 
  //fetch data code using mongo (rows means query result)
  if(rows.length > 0) {
    if(rows[0].password == password) 
    {
      done(null, {
                    firstname: rows[0].firstname,
                    lastname  : rows[0].lastname,
                    email     : rows[0].email,
                    username  : rows[0].username,
                    password  : rows[0].password,
                    nodes     : rows[0].nodes 
                  });
    }
    else
    {
      done(null, false);
    }
  }
  else
  {
    done(null, false);
  }
}));

// called in number 2 argument get
// registration using another function without passport
var authentication = function(req, res, done) 
{
  if(req.isAuthenticated())
  {
    done();
  }
  else
  {
    // redirect to error page ex -> res.redirect('error page');
  }
}

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
router.get('/login', authentication ,function(req, res, next) {
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
