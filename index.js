require('dotenv').config();
let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let db = require('./db');
let PORT = process.env.PORT || 4000;
let urlencoded = bodyParser.urlencoded({extended: false});
let jsonencoded = bodyParser.json();

let server = http.createServer(app);

// GET /drugs
app.get('/', (req, res)=>{
	console.log('Working');
	res.send('Working');
});

// GET /drugs
app.get('/drugs', (req, res)=>{
	db.drug.findAll()
		.then(function(drugs){
			// check if the drugs are found
			console.log(drugs);
			res.json(drugs);
		}, function (e) {
			res.send(e);
		});
});

// POST /add
app.post('/add', urlencoded, (req, res)=>{
	let body = req.body
	db.drug.create(body)
		.then(function(drug){
			res.json(drug);
			console.log(drug.toJSON());
		}, function(e){
			res.send(e);
		});
});

// PUT /update/:id
app.put('/update/:id', urlencoded, (req, res)=>{
	db.drug.findOne({where: {id: req.params.id}})
		.then(function(drugFound){
			// check if drug has been found
			return drugFound.update(req.body);
		}, function(){
			res.status(404).send();
		})
		.then(function(drugUpdate){
			res.json(drugUpdate);
		}, function(){
			res.status(500).send();
		});
});

app.delete('/pluck/:id', urlencoded, (req, res)=>{
	db.drug.findOne({where: {id: req.params.id}})
		.then(function(drugFound){
			// check if drug has been found
			return drugFound.destroy(req.body);
		}, function(){
			res.status(404).send();
		})
		.then(function(drugUpdate){
			res.json(drugUpdate);
		}, function(){
			res.status(500).send();
		});
});

// syncing server with database
db.sequelizeInst.sync({force : false})
	.then(function(){
		server.listen(PORT, ()=>{
			console.log(`server is running on port ${PORT}`);
		});
	}, function(e){
		console.error(e);
	});