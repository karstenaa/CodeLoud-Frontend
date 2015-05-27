var express = require('express')();
var router = express;//express.Router();
var mongoose = require('mongoose');
var request = require('request');
var session = require('express-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Node = require('../models/node');
var Usage = require('../models/usage');
var Balance = require('../models/balance'); //Add balance.js here

var backendIP = "http://10.151.34.98";

express.use(session({secret: 'secretdude', saveUninitialized: true,
                 resave: true}));
express.use(passport.initialize());
express.use(passport.session());



passport.use(new LocalStrategy({
    usernameField: 'uname',
    passwordField: 'passwd'
  },function(username, password, done) {
  	User.findOne({username : username, password : password},function(err, user){
  		if(user){
			done(null, user);
		}
	  	else
	    	done(null, false);
	});
}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// called in number 2 argument get
// registration using another function without passport
var authentication = function(req, res, done) 
{
  if(req.isAuthenticated())
  {
    //done();
  	done();
  }
  else
  {
  	res.redirect('/login');
    // redirect to error page ex -> res.redirect('error page');
  }
};

router.get('/documentation', function(req, res){
	res.redirect('http://www.docdroid.net/file/download/10v09/userguide.pdf');
});

/* logout */
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  
});

/* GET log in page */
router.get('/login' ,function(req, res, next) {
  res.render('login');
  
});

router.post('/authenticate',passport.authenticate('local', { successRedirect: '/dashboard',
	failureRedirect: '/login'})
);
router.post('/register', function(req,res){
	console.log(req.body);
	console.dir(req.body);
	var user = User({
		firstname : req.body.fname,
		lastname  : req.body.lname,
		email     : req.body.email,
		username  : req.body.username,
		password  : req.body.password
	});
	user.save();
	res.render('login');
});
router.post('/node',function(req,res){

});
/* GET register page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* PLEASE CHECK HERE + models/balance.js */
router.get('/charge', authentication, function(req, res, next) {
  res.render('balance');
});

//Note : use REST as you like, and change in balance.ejs in form action, in example using REST /pay here
router.post('/pay', authentication, function(req, res, next) {

	Balance.findOne({username : req.user.username}, function(err, data) {
		if(!data)
		{
			var payment = Balance( {username: req.user.username, balance: req.body.nominal, last_payment: new Date()} );
			payment.save();
		}
		else
		{
			var current = data.balance;

			var condition = {username: req.user.username}, 
				update = { balance: req.body.nominal + current, last_payment : new Date() }, 
				options = { multi: true };

			Balance.update(condition, update, options, callback);
		}

		res.redirect('/balance');
	})
})

router.get('/balance', authentication, function(req, res, next) {
  
  Balance.findOne({username : req.user.username}, function(err, balance_data) {
  	if(!balance_data)
  	{
  		res.render('current_balance');
  	}
  	else
  	{
  		res.render('current_balance', {data: balance_data});
  	}
  })
});

/* UNTIL HERE */

router.post('/node',function(req, res, next){
	var node = Node({	cpu : req.body.cpu,
						ram : req.body.ram,
						url : req.body.url,
						name : req.body.name,
						status : 0
						 
					});
});

router.get('/dashboard',authentication,function(req,res,next){

	//var dataParse = JSON.parse(data.toString());
	//var dataParse = Object.prototype.toString.apply(data);
	//req.user.populate('nodes').exec();
	// req.user.populate('nodes').exec(function (err, person) {
	// 	  if (err) return handleError(err);
	// 	  //console.log(person);
	// 	  console.dir(person);
	// });
	
	
	// console.log(req.user);
	res.render('dashboard');
	//Node.find({_id: { $in: req.user.nodes  } }, function (err, nodes) {
		//console.log("--repoRef--\n" + data["nodes"] + "\n--repoRef--\n");
		//console.log("--repos--\n" + data2 + "\n--repos--\n");
		//res.render('dashboard', { 'data': nodes});
	//})
});

router.get('/history',authentication, function(req, res, next) {
  res.render('history');
	Node.find({_id: { $in: data["nodes"]  } }, function (err, data2) {
		//console.log("--repoRef--\n" + data["nodes"] + "\n--repoRef--\n");
		console.log("--repos--\n" + data2[0] + "\n--repos--\n");
		res.render('dashboard', {data: data2});
	})
});

/*
router.post('/container', function(req, res) {
	console.log("--this is json dude--\n" + JSON.stringify(req.body) + "\n--this is json dude--\n");
	res.redirect('/dashboard');
})
*/

/* Send node data to server */
router.post('/rest/node',authentication,function(req,res){
	console.log(req.body);
	var today = new.Date();
	var node = {
		user	: req.user._id,
		cpu 	: req.body.cpu,
  		ram 	: req.body.ram,
  		repo 	: req.body.url
  		//date 	: 
  		//name	: req.body.name
	};
	//node.save();
	//req.user.nodes.push(node);
	//req.user.save();	
	//var saveResponse;
	request({
		// Change IP address to back-end defined IP
		url: backendIP + '/container', //URL to hit
		//url: 'http://10.151.34.159:3000/container', //URL to hit
		method: 'POST',
		//Lets post the following key/values as form
		json: true,
		body: node
	}, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		   //var  saveResponse = body;
		   console.log(body);
		   res.redirect('/dashboard');
		}
	});
	//console.log(saveResponse);
	//res.redirect('/dashboard');
});

router.get('/rest/node/list',authentication,function(req,res){
	Node.find({_id: { $in: req.user.nodes  }, status: "false" }, function (err, nodes) {
		//console.log("--repoRef--\n" + data["nodes"] + "\n--repoRef--\n");
		//console.log("--repos--\n" + data2 + "\n--repos--\n");
		console.log(nodes);
		res.json(nodes);
	})
});
router.get('/rest/node/history',authentication,function(req,res){
	Node.find({_id: { $in: req.user.nodes  }, status: "true" }, function (err, nodes) {
		//console.log("--repoRef--\n" + data["nodes"] + "\n--repoRef--\n");
		//console.log("--repos--\n" + data2 + "\n--repos--\n");
		console.log(nodes);
		res.json(nodes);
	})
});
router.get('/rest/node/output/:id',authentication,function(req,res){
	request({
		// Change IP address to back-end defined IP
		url: backendIP + '/container/' + req.params.id + '/output', //URL to hit
		method: 'GET'
	}, function (error, response, body) {
		if (error) {
			console.log(error);
			res.end();
		} else {
			res.json(body);
			console.log(response.statusCode, body); // This is the output, manipulate this.
		}
	});
});

/* On STDIN submit button */
router.post('/rest/node/input/:id', authentication, function(req, res){
	console.log(req.body);
	var stdin = { stdin : req.body.stdin};
	console.log("input" + stdin);
	request({
		// Change IP address to back-end defined IP
		url: backendIP + '/container/' + req.params.id + '/input', //URL to hit
		method: 'POST',
		json: true,
		body: stdin
	}, function (error, response, body) {
		if (error) {
			console.log(error);
			res.end();
		} else {
			res.end(body);
			console.log(response.statusCode, body);
		}
	});
});

router.get('/add',authentication,function (req,res){
	res.render('addrepo');
});

/* For run button on repo list page */
router.get('/run', authentication, function(req, res){
	// Get container id
	var container_id = req.query.repo;

	request({
		// Change IP address to back-end defined IP
		url: backendIP + '/container' + container_id + '/output', //URL to hit
		method: 'GET'
	}, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body); // This is the output, manipulate this.
		}
		res.redirect('/dashboard');
	});
});

module.exports = router;
