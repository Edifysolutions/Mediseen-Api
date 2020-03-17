const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

function _user(sequelize, DataType){
	let _user = sequelize.define('user', {
		username: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [6, 30]
			}
		},
		email: {
			type: DataType.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataType.VIRTUAL,
			allowNull: false,
			validate: {
				len: [6, 30]
			},
			set: function(value){
				const salt = bcrypt.genSaltSync(10);
				const hashed = bcrypt.hashSync(value, salt);

				this.setDataValue('salt', salt);
				this.setDataValue('hash', hashed);
				this.setDataValue('password', value);
			}
		},
		hash: {
			type: DataType.STRING
		},
		salt: {
			type: DataType.STRING
		},
		userType: {
			type: DataType.ENUM,
			allowNull: false,
			values: ['free', 'starter', 'dev'],
			defaultValue: "free"
		},
		session_token:{
			type: DataType.STRING,
			defaultValue: "",
			allowNull: true
		}
	},
	{
		hooks: {
			beforeValidate: function(user, option){
				if(user.email && typeof user.email == "string"){
					user.email = user.email.toLowerCase().trim();
				}
				if(user.username && typeof user.username == "string"){
					user.username = user.username.toLowerCase().trim();
				}
			}
		}
	});

		// instance methods
	_user.prototype.toPublicJSON = function() {
		let values = this.toJSON();
		return _.omit(values, "salt", "hash", "updatedAt", "createdAt", "password");
	};

	_user.prototype.generateToken = function(type){
		// type refers to the type of token to be generated
		if (!_.isString(type)) {
			return undefined;
		}

		try{
			let stringData = JSON.stringify({
				id: this.get('id'),
				type: type
			});
			let encrytedData = cryptojs.AES.encrypt(stringData, process.env.ENC_KEY).toString();
			return jwt.sign({token: encrytedData}, process.env.TOKEN_ENC_KEY);
		}catch(e) {
			return undefined;
		}
	}

	// class methods
	_user.authenticate = function(body){
		return new Promise(function(resolve, reject){
			_user.findOne({
				where: {
					email: body.email.toLowerCase().trim()
				}
			}).then(function(user) {
				if (!user || !bcrypt.compareSync(body.password, user.get('hash'))) {
					return reject();
				}
				resolve(user);
			}, function() {
				reject();
			});
		});
	}

	_user.findByToken = function(token){
		return new Promise(function(resolve, reject){
			try{
				let decodedData = jwt.verify(token, process.env.TOKEN_ENC_KEY);
				let decryptedData = cryptojs.AES.decrypt(decodedData.token, process.env.ENC_KEY).toString(cryptojs.enc.Utf8);
				let key = JSON.parse(decryptedData);

				_user.findByPk(key.id).then(function(user){
					if (!user) return reject();
					resolve(user);
				}, function(){
					reject();
				});
			}catch(e){
				reject()
			}
		});
	}

	return _user;
}

module.exports = _user;