module.exports = function(sequelize, DataType){
	return sequelize.define('drug', {
		drug_name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [3, 250]
			}
		},
		manufacturer: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [3, 60]
			}
		},
		side_effect: {
			type: DataType.TEXT,
			allowNull: true
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
			allowNull: true,
			defaultValue: null
		},
		nafdac_reg: {
			type: DataType.STRING,
			allowNull: false,
			len: [3, 30]
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
}