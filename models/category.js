module.exports = function (sequelize, DataType) {
	let category = sequelize.define('category',{
		drug_name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [3, 250]
			}
		},
		dosage_form: {
			type: DataType.ENUM,
			allowNull: false,
			values: ['capsule', 'tablet', 'syrup', 'injection']
		}
	})


	return category;
}