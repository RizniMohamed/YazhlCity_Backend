const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Payment = sequelize.define('Payment', {
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : false
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Payment
