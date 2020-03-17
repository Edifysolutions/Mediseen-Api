const express = require('express');
const route = express.Router();
const db = require('../db');

route.use(express.urlencoded({extended: false}));
route.use(express.json());

route.post('/view-key', (req, res)=>{
	res.send('/view-key');
});

route.post('/sign-up', (req, res)=>{
	db.user.create(req.body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(e){
		res.status(400).send(e);
	});
});

route.post('/sign-in', (req, res)=>{
	console.log(req.body);
	db.user.authenticate(req.body).then(function(user) {
		res.header("Auth", user.generateToken('authentication')).json(user.toPublicJSON());
	}, function(e) {
		res.status(401).send();
	});
});

// route.post('user', ()=>{

// });

module.exports = route;

/*
	1. Create user 		// POST /sign-up
	2. Create API key (handler function)
	3. Generate and Get API key		// POST /view-key
	4. Login user			// POST /login
*/