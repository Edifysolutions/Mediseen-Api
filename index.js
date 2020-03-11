require('dotenv').config();
let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let PORT = process.env.PORT || 4000;
let server = http.createServer(app);
const DROP_DB = false;
const _ = require('underscore');
let db = require('./db');
let api = require('./routes/api');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// /api/*
app.use('/api', api);

// GET /drugs
app.get('/', (req, res)=>{
	res.send(`
		<h1>
			Working
		</h1>
	`);
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

// syncing server with database
db.sequelizeInst.sync({force : DROP_DB}).then(function(){
	server.listen(PORT, ()=>{
		console.log(`server is running on port ${PORT}`);
		console.log(`database return status ${process.env.REFRESH_DB}`, typeof process.env.REFRESH_DB)
	});
}, function(e){
	console.error(e);
});