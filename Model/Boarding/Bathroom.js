const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Bathroom = sequelize.define('Bathroom', {
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Bathroom
