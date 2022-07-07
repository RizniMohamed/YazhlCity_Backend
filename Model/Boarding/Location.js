const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Location
