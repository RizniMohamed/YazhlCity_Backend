const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Sequelize');

const BoardingImage = sequelize.define('Boarding_image', {
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = BoardingImage
