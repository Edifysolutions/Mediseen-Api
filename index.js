require('dotenv').config();
let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const _ = require('underscore');
let db = require('./db');
let PORT = process.env.PORT || 4000;

let server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// GET /drugs
app.get('/', (req, res)=>{
	res.send('Working');
});

// GET /drug/id?
app.get('/drug/:id', (req, res)=>{
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

// GET /drugs
app.get('/drugs', (req, res)=>{
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
app.post('/add', (req, res)=>{
	let body = req.body;
	db.drug.create(body).then(function(drug){
		res.json(drug.toPublicJOSN());
	}, function(e){
		res.status(400).send(e);
	});
});

app.post('/sign-up', (req, res)=>{
	let body = req.body;
	body.forEach(detail=>detail = detail.trim());
	db.user.create(body).then(function(user){
		res.json(user.toPublicJOSN());
	}, function(e){
		res.status(400).send(e);
	});
});

// PUT /update/:id
app.put('/update/:id', (req, res)=>{
	db.drug.findByPk(req.params.id).then(function(drugFound){
		// check if drug has been found
		if (drugFound){
			drugFound.update(req.body).then(function(drugUpdate){
				res.json(drugUpdate.toPublicJOSN());
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

app.delete('/pluck/:id', (req, res)=>{
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

// syncing server with database
db.sequelizeInst.sync(/*{force : true}*/).then(function(){
	server.listen(PORT, ()=>{
		console.log(`server is running on port ${PORT}`);
		console.log(`database return status ${process.env.REFRESH_DB}`, typeof process.env.REFRESH_DB)
	});
}, function(e){
	console.error(e);
});