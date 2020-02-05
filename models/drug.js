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
				len: [3, 250]
			}
		},
		composition: {
			type: DataType.TEXT,
			allowNull: false/*,
			validate: {
				len: [1, 250]
			}*/
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
			type: DataType.STRING,
			allowNull: true,
			defaultValue: null
		},
		nafdac_reg: {
			type: DataType.STRING,
			allowNull: false,
			len: [3, 20]
		}
	});
}