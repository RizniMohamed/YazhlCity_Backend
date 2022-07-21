const Location = require("../Boarding/Location");
const PaymentType = require("../Payment/PaymentType");
const Facility = require("../Room/Facility");
const Role = require("../User/Role");
const User = require("../User/User");
const Auth = require("../User/Auth");
const Room = require("../Room/Room");

//roles
(async () => {
    await Role.sync();
    const roles = await Role.findAll()
    if (roles.length === 0) Role.bulkCreate([{ name: "admin" }, { name: "manager" }, { name: "hosteller" }, { name: "user" }])
})();

//locations
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

//locations
(async () => {
    await Facility.sync();
    const facility = await Facility.findAll()
    if (facility.length === 0) Facility.bulkCreate([
        { name: "Table" },
        { name: "Chair" },
        { name: "Metress" },
        { name: "Bed" },
        { name: "Fan" },
    ])
})();

//payment type
(async () => {
    await PaymentType.sync();
    const paymentType = await PaymentType.findAll()
    if (paymentType.length === 0) PaymentType.bulkCreate([
        { name: "Credit Card" },
        { name: "Cash" },
    ])
})();

//create admin
(async () => {
    await Room.sync()
    await User.sync();
    await Auth.sync();
    const users = await User.findAll()
    const auths = await Auth.findAll()
    if (users.length === 0 && auths.length === 0) {
        const { id: userID } = await User.create({ name: "Rizni Mohamed" })
        const newAuth = await Auth.create({ email: "mnriznimohamed@gmail.com", password: "0775824807", userID: userID, role : 1 })
    }

})();