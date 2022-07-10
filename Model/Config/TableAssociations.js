//initialize models
//User schema
const Auth = require('../User/Auth');
const User = require('../User/User')
const Role = require('../User/Role')

//boarding schema
const Boarding = require('../Boarding/Boarding')
const Location = require('../Boarding/Location');
const BoardingImage = require('../Boarding/BoardingImage');
const Washroom = require('../Boarding/Washroom');
const Bathroom = require('../Boarding/Bathroom');

//room schema
const Facility = require('../Room/Facility.js')
const Room = require('../Room/Room.js')

//payment schema
const Payment = require('../Payment/Payment.js')
const PaymentType = require('../Payment/PaymentType.js');
const sequelize = require('./Sequelize');

User.hasOne(Auth, { // auth will have user id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'userID',
        allowNull: false
    },
})

User.belongsTo(Role, { // user will have role id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'roleID',
        allowNull: false,
        defaultValue: 4
    },
});

Boarding.belongsTo(Location, { // boarding will have location id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'locationID',
        allowNull: false,
    },
});

Boarding.belongsTo(User, { // boarding will have user id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'userID',
        allowNull: false,
        unique: {
            args: true,
            name: "userID",
            msg: 'userID already in use'
        }
    },
});

Boarding.hasMany(BoardingImage, { // boarding image will have boarding id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'boardingID',
        allowNull: false,
    },
});

Boarding.hasOne(Washroom, { // washroom will have boarding id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'boardingID',
        allowNull: false,
    },
});

Boarding.hasOne(Bathroom, { // bathroom will have boarding id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'boardingID',
        allowNull: false,
    },
});

Boarding.hasMany(Room, { // room will have boarding id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'boardingID',
        allowNull: false,
    },
});

Room.belongsToMany(Facility, { // room and facility will joined by room_facility table
    through: "Room_Facility",
    timestamps: false,
});

Room.hasMany(User, { // user will have room id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'roomID',
        allowNull: true,
    },
});

Payment.belongsTo(PaymentType, { // payment will have payment type id as foreign key
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'paymentTypeID',
        allowNull: true,
    },
});

User.hasMany(Payment, {
    constraints: { onDelete: "CASCADE", onUpdate: "CASCADE" },
    foreignKey: {
        name: 'userID',
        allowNull: false,
    },
});
