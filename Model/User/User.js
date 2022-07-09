const { StatusCodes } = require('http-status-codes');
const { DataTypes } = require('sequelize');
const { APIError } = require('../../Middleware/errorHandler');
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
        allowNull: true,
        validate: {
            isIn: {
                args: [['male', 'female']],
                msg: "Must be 'male' or 'female'"
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mobile: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            len: {
                args: [9, 9],
                msg: "Phone number need to be 9 digits (without first zero)",
            }
        }
    },
    nic: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            args: true,
            name: "nic",
            msg: 'NIC already in use'
        },
        validate: {
            checkNicFormate(nic) {
                if (nic) {
                    if (nic.length !== 10 && nic.length !== 12)
                        throw new APIError("NIC is must be new 12 digit format or old format includes V at the end", StatusCodes.BAD_REQUEST)
                    if (nic.length == 10 && nic[nic.length - 1].toLowerCase() !== "v")
                        throw new APIError("NIC is must includes V at the end", StatusCodes.BAD_REQUEST)
                    if (nic.length == 12 && (nic.includes("v") || nic.includes("V")))
                        throw new APIError("NIC new format doesnt includes V", StatusCodes.BAD_REQUEST)
                }
            }
        }
    }
}, {
    timestamps: false,
});

module.exports = User
