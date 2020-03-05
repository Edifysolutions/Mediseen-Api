let _ = require('underscore');
module.exports = function(sequelize, DataType){
	let _drug = sequelize.define('drug', {
		drug_name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [3, 250]
			}
		},
		therapeuthic_class: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [3, 60]
			}
		},
		manufacturer: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [3, 60]
			}
		},
		adverse_effect: {
			type: DataType.TEXT,
			allowNull: false
		},
		composition: {
			type: DataType.TEXT,
			allowNull: false
		},
		dosage_form: {
			type: DataType.ENUM,
			allowNull: false,
			values: ['capsule', 'tablet', 'syrup', 'injection']
		},
		dosage_administration: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [7, 250]
			}
		},
		storage_handling: {
			type: DataType.TEXT,
			allowNull: false,
			defaultValue: "Store in cool dry place"
		},
		nafdac_reg: {
			type: DataType.STRING,
			allowNull: false,
			len: [3, 30]
		},
		precaution: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [3, 250]
			}
		},
		pharmacology: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [3, 250]
			}
		},
		interaction: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [3, 250]
			}
		}
	},
	{
		hooks: {
			beforeValidate: function(drug, option){
				if(drug.drug_name && typeof drug.drug_name == "string"){
					drug.drug_name = drug.drug_name.toLowerCase().trim();
				}
			}
		}
	});

	_drug.prototype.toPublicJOSN = function() {
		let values = this.toJSON();
		return _.omit(values, "createdAt", "updatedAt");
	};

	return _drug;
}