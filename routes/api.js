let express = require('express');
let route = express.Router();
let db = require('../db');
let _ = require('underscore');
const auth_and_check = require('../middlewares/auth_and_check')(db);
const freeKey = process.env.FREE_API_KEY;
// const checkKey = require('../middlewares/check-key');

// GET /drug/id
route.get('/drug/:id', (req, res)=>{
	db.drug.findByPk(req.params.id).then(function(drug){
		if (drug) {
			res.json(drug);
		}else{
			res.status(404).send();
		}
	}, function(e){
		res.status(500).send();
	});
});

// GET /drugs?drug_name=&category=&range=
route.get('/drugs', /*checkKey,*/ (req, res)=>{
	let where = {};
	let attribute = {}
	if (req.query.drug_name) {
		where.drug_name = {
			$like: `%${req.query.drug_name}%`
		};
	}
	if (req.query.category) {
		where.dosage_form = {
			$like: `%${req.query.category}%`
		};
	}
	attribute.where = where;
	attribute.limit = req.query.size || 5;
	attribute.offset = req.query.prev || 0;
	db.drug.findAll(where).then(function(drug){
		if (drug) {
			res.json(drug);
		}else{
			res.status(404).send();
		}
	}, function(e){
		res.status(500).send();
	});
});

// POST /add
route.post('/add', auth_and_check.requestAuthenticationToken, (req, res)=>{
	let body = req.body;
	db.drug.create(body).then(function(drug){
		res.json(drug.toPublicJOSN());
	}, function(e){
		res.status(400).send(e);
	});
});

route.post('/create-key', auth_and_check.requestAuthenticationToken, (req, res)=>{
	const apikey = db.key.generateApiKey(req.user.dataValues);

	db.key.create(apikey).then(function(key){
		req.user.addKey(key).then(function(){
			return key.reload();
		}, function(){
			res.status(500).send();
		}).then(function(key){
			res.json(key.toPublicJOSN());
		},function(){
			res.status(500).send();
		});
	}, function(e){
		res.status(400).send(e);
	});
});

// PUT /update/:id
route.put('/update/:id', auth_and_check.requestAuthenticationToken, (req, res)=>{
	db.drug.findByPk(req.params.id).then(function(drugFound){
		// check if drug has been found
		if (drugFound){
			drugFound.update(req.body).then(function(drugUpdate){
				res.json(drugUpdate);
			}, function(){
				res.status(500).send();
			});
		}else{
			res.status(404).send();
		}
	}, function(){
		res.status(400).send();
	});
});

route.delete('/pluck/:id', auth_and_check.requestAuthenticationToken, (req, res)=>{
	db.drug.findByPk(req.params.id).then(function(drugFound){
		// check if drug has been found
		if (drugFound){
			drugFound.destroy(req.body).then(function(drugUpdate){
				res.json(drugUpdate);
			}, function(){
				res.status(500).send();
			});
		}else{
			res.status(404).send();
		}
	}, function(){
		res.status(404).send();
	});
});

module.exports = route;