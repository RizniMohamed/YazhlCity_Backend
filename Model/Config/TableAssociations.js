//initialize models
const Auth = require('../User/Auth');
const User = require('../User/User')
const Role = require('../User/Role')

// const Location = require('../Boarding/Location')
const Boarding = require('../Boarding/Boarding')
const Location = require('../Boarding/Location');
const BoardingImage = require('../Boarding/Image');

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

User.belongsTo(Role, { // user will have role id as foreign key
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

Boarding.belongsTo(Location, { // boarding will have location id as foreign key
    constraints: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    foreignKey: {
        name: 'locationID',
        allowNull: false,
    },
});

Boarding.belongsTo(User, { // boarding will have user id as foreign key
    constraints: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
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
    constraints: {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    foreignKey: {
        name: 'boardingID',
        allowNull: false,
    },
});

(async () => {
    await Role.sync();
    const roles = await Role.findAll()
    if (roles.length === 0) Role.bulkCreate([{ name: "admin" }, { name: "manager" }, { name: "hosteller" }, { name: "user" }])
})();

(async () => {
    await Location.sync();
    const locations = await Location.findAll()
    if (locations.length === 0) Location.bulkCreate([
        { name: "Achchuveli" },
        { name: "Alaveddy" },
        { name: "Aliyawalai" },
        { name: "Araly" },
        { name: "Chankanai" },
        { name: "Chavakachcheri" },
        { name: "Chunnakam" },
        { name: "Erlalai" },
        { name: "Kadduvan" },
        { name: "Kaithady" },
        { name: "Kankesanthurai" },
        { name: "Karainagar" },
        { name: "Karaveddy" },
        { name: "Kayts" },
        { name: "Keerimalai" },
        { name: "Kerudavil" },
        { name: "Kodikamam" },
        { name: "Kokkuvil" },
        { name: "Kondavil" },
        { name: "Kopay" },
        { name: "Mallakam" },
        { name: "Manipay" },
        { name: "Mirusuvil" },
        { name: "Moolai" },
        { name: "Myliddy" },
        { name: "Nagar Kovil" },
        { name: "Nallur" },
        { name: "Navaly" },
        { name: "Navatkuli" },
        { name: "Nelliady" },
        { name: "Nelliyady" },
        { name: "Palaly" },
        { name: "Point Pedro" },
        { name: "Polikandy" },
        { name: "Puttur" },
        { name: "Sandilipay" },
        { name: "Tellippalai" },
        { name: "Thampalai" },
        { name: "Thirunelveli" },
        { name: "Thondaimanaru" },
        { name: "Thoppu" },
        { name: "Thumpalai" },
        { name: "Tirunelveli East" },
        { name: "Tirunelveli West" },
        { name: "Udupiddy" },
        { name: "Uduthurai" },
        { name: "Uduvil" },
        { name: "Urelu" },
        { name: "Urumpirai" },
        { name: "Vaddukkoddai East" },
        { name: "Vaddukkoddai West" },
        { name: "Vaddukoddai" },
        { name: "Valalai" },
        { name: "Vallipuram" },
        { name: "Valveddi" },
        { name: "Varani" },
        { name: "Velanai" },
        { name: "Vellampakkaddy" },
        { name: "Vidattalpalai" },
        { name: "Viyaparimulai" },
    ])
})();