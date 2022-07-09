const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const Role = sequelize.define('role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            name: "name",
            msg: 'Role name already in use'
        }
    },
}, {
    timestamps: false,
});

module.exports = Role
