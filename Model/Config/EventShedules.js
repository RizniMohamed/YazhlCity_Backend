const cron = require('node-cron');
const Boarding = require('../Boarding/Boarding');
const Payment = require('../Payment/Payment');
const Room = require('../Room/Room');
const User = require('../User/User');

// Create payments on each 1st day of month
            // S M H D M W <- runs on first day of each month
cron.schedule('0 0 0 1 * *', async () => {
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

// remove access to the persons who not paid for 2 months
            // S M H D M W  <- runs on every miniute 
cron.schedule('1 * * * * *', async () => {
    console.log("Payment check event started");
    const users = await User.findAll()
    users.forEach(async user => {
        const payments = await Payment.findAll({ where: { userID: user.id } })
        let counter = 0
        payments.forEach(payment => (payment.status == false) ? counter += 1 : null)
        if (counter >= 2)
            await User.update({ active: false }, { where: { id: user.id } })
        else
            await User.update({ active: true }, { where: { id: user.id } })
    })
    console.log("Payment check event end");
});