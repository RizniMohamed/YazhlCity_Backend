const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');
const bcrypt = require('bcryptjs')

const Auth = sequelize.define('Auth', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Invalid email format"
            }
        },
        unique: {
            args: true,
            name: "email",
            msg: 'Email address already in use'
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8],
                msg: "Password need to be more than 8 characters",
            }
        },
        set(value) {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(value, salt)
            this.setDataValue('password', hashedPassword);
        },
    }
}, {
    timestamps: false,
});

module.exports = Auth
