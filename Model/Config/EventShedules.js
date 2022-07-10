const cron = require('node-cron');
const Boarding = require('../Boarding/Boarding');
const Payment = require('../Payment/Payment');
const Room = require('../Room/Room');
const User = require('../User/User');

// Create payments on each 1st day of month 0 0 0 1 1 0
            // S M H D M W
cron.schedule('1 * * * * *', async () => {
    console.log("Payment event started");
    //create monthly payment for hosttellers
    const hostellers = await User.findAll({ where: { roomID: !null } })
    if (hostellers.length !== 0) {
        hostellers.forEach(async hosteller => {
            const { price } = await Room.findOne({ where: { id: hosteller.roomID } })
            await Payment.create({ amount: price, userID: hosteller.id })
        })
    }
    //create monthly payment for owners
    const owners = await Boarding.findAll()
    if (owners.length !== 0) {
        owners.forEach(async owner => {
            await Payment.create({ amount: process.env.MANAGER_FEE, userID: owner.userID })
        })
    }
    console.log("Payment event end");
});