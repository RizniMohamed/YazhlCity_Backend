const Location = require("../Boarding/Location");
const PaymentType = require("../Payment/PaymentType");
const Facility = require("../Room/Facility");
const Role = require("../User/Role");

//roles
(async () => {

    const roles = await Role.findAll()
    if (roles.length === 0) Role.bulkCreate([{ name: "admin" }, { name: "manager" }, { name: "hosteller" }, { name: "user" }])
})();

//locations
(async () => {
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
    const paymentType = await PaymentType.findAll()
    if (paymentType.length === 0) PaymentType.bulkCreate([
        { name: "Credit Card" },
        { name: "Cash" },
    ])
})();
