let bcrypt = require('bcrypt');
let _ = require('underscore');
module.exports = function(sequelize, DataType){
	let _user= sequelize.define('user', {
		email: {
			type: DataType.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		username:{
			type: DataType.STRING,
			unique: true,
			allowNull: true,
			defaultValue: this.email
		},
		salt: {
			type: DataType.STRING,
			allowNull: false
		},
		hash: {
			type: DataType.STRING,
			allowNull: false
		},
		password: {
			type: DataType.VIRTUAL,
			unique: true,
			allowNull: false,
			validate: {
				len: [6, 30]
			},
			set: function(value){
				const salt = bcrypt.genSaltSync(10);
				const hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('salt', salt);
				this.setDataValue('hash', hashedPassword);
				this.setDataValue('password', value);
			}
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
	_user.prototype.toPublic = function() {
		let values = this.toJSON();
		return _.pick(values, "email", "username", "updatedAt", "createdAt", "id");
	};
	return _user;
}