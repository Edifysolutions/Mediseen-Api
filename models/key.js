const cryptojs = require('crypto-js');
let _ = require('underscore');

function key(sequelize, DataType){
	let key = sequelize.define('key',{
		token:{
			type: DataType.STRING,
			allowNull: true
		},
		expairyDate: {
			type: DataType.DATE,
			allowNull: true
		}
	});

	key.prototype.toPublicJOSN = function() {
		const values = this.toJSON();
		return _.omit(values, "createdAt", "updatedAt");
	};

	// class
	key.generateApiKey = function(user){
		const {email, userType} = user;
		let flag;
		let exDate = new Date();
		const codedKey = cryptojs.AES.encrypt(email, process.env.ENC_KEY).toString(); // create api-key with and ENC_KEY

		console.log('flag is', userType);
		if (user.userType == "dev") {
			flag = `MDD-`;
			exDate = new Date(new Date().setDate(120));
		}else if(user.userType == "starter"){
			flag = `MSS-`;
			exDate = new Date(new Date().setDate(30));
		}else{
			flag = `MFF-`;
			exDate = new Date(new Date().setDate(999999));
		}

		console.log(exDate, typeof exDate);
		
		return {
			token: flag+codedKey,
			expairy_date: exDate.toISOString()
		};
	}

	return key;
}

module.exports = key;