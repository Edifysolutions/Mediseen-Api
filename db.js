let Sequelize = require("sequelize");
let sequelizeInst;

if (process.env.NODE_ENV == "development") {
	sequelizeInst = new Sequelize(undefined, undefined, undefined, {
		dialect: "sqlite",
		storage: __dirname+"/data/database.sqlite",
		// logging: true
	});
}else{
	// set-up connection to production env
}

let db = {};

db.Sequelize = Sequelize;
db.sequelizeInst = sequelizeInst;
db.drug = sequelizeInst.import(__dirname+'/models/drug.js');

module.exports = db;

