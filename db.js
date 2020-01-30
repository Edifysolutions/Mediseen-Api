let Sequelize = require("sequelize");
let sequelizeInst = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD,{
	host: process.env.HOST,
	dialect: "mysql",
	logging: false
});
let db = {};

db.Sequelize = Sequelize;
db.sequelizeInst = sequelizeInst;
db.drug = sequelizeInst.import(__dirname+'/models/drug.js');

module.exports = db;

