const { StatusCodes } = require('http-status-codes');
const { APIError } = require('../../Middleware/errorHandler')
const User = require('../../Model/User/User')
const Role = require('../../Model/User/Role');
const Payment = require('../../Model/Payment/Payment')
const Room = require('../../Model/Room/Room');
const Auth = require('../../Model/User/Auth');
const { Stripe } = require('../Payment/Stripe');

const subscribe = async (req, res) => {
    //filtering incoming data
    const { userID, roomID, payment_USD } = req.body

    //validation
    if (!userID) throw new APIError("User id is required", StatusCodes.BAD_REQUEST)
    if (!roomID) throw new APIError("room id is required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("User not found", StatusCodes.NOT_FOUND)
    const room = await Room.findOne({ where: { id: roomID } })
    if (!room) throw new APIError("room not found", StatusCodes.NOT_FOUND)

    //payment
    req.body.amount = payment_USD
    const paymentStripe = await Stripe(req)
    if (!paymentStripe) throw new APIError("Payment Error", StatusCodes.BAD_GATEWAY)

    //promote user to hosteller
    await User.update({ roomID: roomID, roleID: 3 }, { where: { id: userID } });

    //create hostteller first payment
    await Payment.create({ amount: room.price, userID: userID, status: true })

    //send updated data
    res.status(StatusCodes.OK).json(
        {
            status: StatusCodes.OK,
            data: paymentStripe
        })
}

const unsubscribe = async (req, res) => {
    //filtering incoming data
    const { userID } = req.body

    //validation
    if (!userID) throw new APIError("User id is required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("User not found", StatusCodes.NOT_FOUND)

    //demote hosteller to user
    await User.update({ roomID: null, roleID: 4 }, { where: { id: userID } });

    //delete payments that made by hosteller
    await Payment.destroy({ where: { userID: userID } })

    //send updated data
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: await User.findOne({
            where: { id: userID },
            include: [
                { model: Auth, attributes: ['email'] },
                { model: Role, attributes: ['name'] },
                { model: Payment },
            ]
        })
    })
}

module.exports = {
    subscribe,
    unsubscribe,
}