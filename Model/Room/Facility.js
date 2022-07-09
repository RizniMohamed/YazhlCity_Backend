const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Facility = sequelize.define('Facility', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            name: "name",
            msg: 'facility name already in use'
        }
    },
}, {
    timestamps: false,
});

module.exports = Facility
