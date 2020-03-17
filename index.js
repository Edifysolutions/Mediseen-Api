require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db');
const api = require('./routes/api');
const user = require('./routes/user');
const auth_and_check = require('./middlewares/auth_and_check')(db);

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set("view engine", "ejs");

// /api/*
app.use('/api', api);
app.use(user);

// GET /drugs
app.get('/', auth_and_check.requestAuthenticationToken, (req, res)=>{
	res.send(`
		<h1>
			Working
		</h1>
	`);
});

// syncing server with database
db.sequelizeInst.sync({force : false}).then(function(){
	server.listen(PORT, ()=>{
		console.log(`server is running on port ${PORT}`);
	});
}, function(e){
	console.error(e);
});

// exits
process.on('exit', function(){
	db.sequelizeInst.close();
	console.log('process.exit: shuting down server');
});
process.on('SIGINT', function(){
	db.sequelizeInst.close();
	console.log('Ctrl + C: shuting down server');
	process.exit(2);
});
process.on('uncaughtException', function(e){
	db.sequelizeInst.close();
	console.log('uncaughtException: shuting down server', e);
	process.exit(99);
});