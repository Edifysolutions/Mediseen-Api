module.exports = function(sequelize, DataType){
	return sequelize.define('drug', {
		drug_name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 250]
			}
		},
		perscription: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		dosage: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}
	});
}