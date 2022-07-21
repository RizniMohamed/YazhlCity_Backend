const { DataTypes } = require('sequelize');
const { APIError } = require('../../Middleware/errorHandler');
const sequelize = require('../Config/Sequelize');

const Room = sequelize.define('Room', {
    room_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
            args: true,
            name: "room_number",
            msg: 'room number already in use'
        }
    },
    person_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            min : {
                args : 1,
                msg : "Person counts need to be one or more than one"
            }
        }
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('single', 'share'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['single', 'share']],
                msg: "Must be 'single' or 'share'"
            },
            checIsValid(value) {
                const personCount = this.getDataValue('person_count')
                if (personCount > 1 && value == "single")
                    throw new APIError("Invalid type selection. select share for more than one persons")
                if (personCount == 1 && value == "share")
                    throw new APIError("Invalid type selection. select single for one person")
            }
        }
    },
}, {
    timestamps: false,
});

module.exports = Room
