let Sequelize = require("sequelize");
let sequelizeInst;
const { Client } = require('pg');
let db = {};

if (process.env.NODE_ENV == "development") {
	sequelizeInst = new Sequelize(undefined, undefined, undefined, {
		dialect: "sqlite",
		storage: __dirname+"/data/database.sqlite",
		logging: false
	});
}else{
	// set-up connection to production env
	sequelizeInst = new Sequelize(process.env.DATABASE_URL,{
		dialect: 'postgres',
		ssl: true
	});
}

db.Sequelize = Sequelize;
db.sequelizeInst = sequelizeInst;
db.drug = sequelizeInst.import(__dirname+'/models/drug.js');
db.user = sequelizeInst.import(__dirname+'/models/user.js');
db.key = sequelizeInst.import(__dirname+'/models/key.js');

db.user.hasMany(db.key);
db.key.belongsTo(db.user);

module.exports = db;