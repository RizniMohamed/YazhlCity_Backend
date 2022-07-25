const { StatusCodes } = require('http-status-codes');
const { DataTypes } = require('sequelize');
const { APIError } = require('../../Middleware/errorHandler');
const sequelize = require('../Config/Sequelize');

const Boarding = sequelize.define('Boarding', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    address: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            args: true,
            name: "address",
            msg: 'address already in use'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['male', 'female']],
                msg: "Must be 'male' or 'female'"
            }
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        },
        defaultValue: 0
    },
    geoloc: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('geoloc').split(',')
        },
        set(value) {
            if (value)
                if (value instanceof Array && value.length == 2)
                    this.setDataValue('geoloc', value.join(','))
                else
                    throw new APIError("Invalid Geo location. expected an array as [0.0,0.0]", StatusCodes.BAD_REQUEST)
            else
                throw new APIError("Geo location coodinates required", StatusCodes.BAD_REQUEST)
        },
    },
}, {
    timestamps: true,
}
);

module.exports = Boarding
