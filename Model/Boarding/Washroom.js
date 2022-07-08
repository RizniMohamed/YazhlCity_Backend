const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Washroom = sequelize.define('Washroom', {
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

module.exports = Washroom
