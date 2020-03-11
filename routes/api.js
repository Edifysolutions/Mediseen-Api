let express = require('express');
let route = express.Router();
let db = require('../db');



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
route.get('/drugs', (req, res)=>{
	let where = {};
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
route.post('/add', (req, res)=>{
	let body = req.body;
	db.drug.create(body).then(function(drug){
		res.json(drug.toPublicJOSN());
	}, function(e){
		res.status(400).send(e);
	});
});

// PUT /update/:id
route.put('/update/:id', (req, res)=>{
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

route.delete('/pluck/:id', (req, res)=>{
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