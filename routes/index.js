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

router.post('/node',function(req, res, next){
	var node = Node({	cpu : req.body.cpu,
						ram : req.body.ram,
						url : req.body.url,
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

router.get('/history', function(req, res, next) {
  res.render('history', { title: 'Express' });
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
	var node = {
		user	: req.user._id,
		cpu 	: req.body.cpu,
  		ram 	: req.body.ram,
  		repo 	: req.body.url
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
	Node.find({_id: { $in: req.user.nodes  } }, function (err, nodes) {
		//console.log("--repoRef--\n" + data["nodes"] + "\n--repoRef--\n");
		//console.log("--repos--\n" + data2 + "\n--repos--\n");
		console.log(nodes);
		res.json(nodes);
	})
});
router.get('/rest/node/output',authentication,function(req,res){
	var data = {"wew" : "wew"};
	res.json(data);
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

/* On STDIN submit button */
router.post('/input', authentication, function(req, res){
	var stdin = req.body.stdin;
	request({
		// Change IP address to back-end defined IP
		url: backendIP + '/container' + node.user + '/input', //URL to hit
		method: 'POST',
		json: {
			'stdin': stdin
		}
	}, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
});


module.exports = router;
