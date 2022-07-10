const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const PaymentType = sequelize.define('Payment_type', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = PaymentType
