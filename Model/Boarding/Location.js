const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            name: "name",
            msg: 'location name already in use'
        }
    },
}, {
    timestamps: false,
});

module.exports = Location
