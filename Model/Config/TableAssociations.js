//initialize models
const Auth = require('../User/Auth');
const User = require('../User/User')
const Role = require('../User/Role')

User.hasOne(Auth, { // auth will have user id as foreign key
    constraints: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    foreignKey: {
        name: 'userID',
        allowNull: false
    },
})

Role.bulkCreate([{ name: "admin" }, { name: "manager" }, { name: "hosteller" }, { name: "user" }])

Role.hasOne(User, { // user will have role id as foreign key
    constraints: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    foreignKey: {
        name: 'roleID',
        allowNull: false
    },
})