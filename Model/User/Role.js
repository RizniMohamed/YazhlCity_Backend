const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Role = sequelize.define('role', {
    name: {
        type: DataTypes.ENUM("admin", "manager", "hosteller", "user"),
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Role
