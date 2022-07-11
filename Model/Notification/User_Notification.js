const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const User_Notification = sequelize.define('User_Notification', {

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

}, {
    timestamps: true,
});

module.exports = User_Notification
