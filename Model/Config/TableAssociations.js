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

Role.hasOne(User, { // user will have role id as foreign key
    constraints: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    foreignKey: {
        name: 'roleID',
        allowNull: false,
        defaultValue: 4
    },
});

(async () => {
    await Role.sync({ force: false });
    const roles = await Role.findAll()
    if (roles.length === 0) Role.bulkCreate([{ name: "admin" }, { name: "manager" }, { name: "hosteller" }, { name: "user" }])
})()