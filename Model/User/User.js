const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: {
                args: [9],
                msg: "Phone number need to be 9 digits (without first zero)",
            }
        }
    },
    nic: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: {
                args: [10],
                msg: "NIC is must be new 10 digit format",
            }
        }
    }
}, {
    timestamps: false,
});


module.exports = User
