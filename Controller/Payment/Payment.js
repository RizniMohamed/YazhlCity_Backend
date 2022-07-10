const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../../Middleware/errorHandler')
const Payment = require('../../Model/Payment/Payment')
const PaymentType = require('../../Model/Payment/PaymentType')
const User = require('../../Model/User/User')
const findQueryLogic = require('../FindQueryLogic')

const getPayments = async (req, res) => {
    let { order, attributes, where } = findQueryLogic(req.query.where, req.query.order, req.query.select)

    const payments = await Payment.findAll({
        where,
        order: order ?? ['id'],
        attributes,
        include: [
            { model: PaymentType, attributes: ['name'] },
        ]
    })

    if (payments.length !== 0)
        res.status(StatusCodes.OK).json({ count: payments.length, payments })
    else
        res.status(StatusCodes.NOT_FOUND).json({ message: "No payments found" })
}


const makePayment = async (req, res) => {
    //filtering incoming data
    const { paymentTypeID,  paymentID } = req.body

    //validation
    if (!paymentTypeID) throw new APIError("paymentTypeID is required", StatusCodes.BAD_REQUEST)
    const paymentType = await PaymentType.findOne({ where: { id: paymentTypeID } })
    if (!paymentType) throw new APIError("paymentType not found", StatusCodes.NOT_FOUND)
    if (!paymentID) throw new APIError("paymentID is required", StatusCodes.BAD_REQUEST)
    const payment = await Payment.findOne({ where: { id: paymentID } })
    if (!payment) throw new APIError("payment not found", StatusCodes.NOT_FOUND)

    //update payment
    await Payment.update(
        { paymentTypeID: paymentTypeID, status: true },
        { where: { id: paymentID } }
    );
   
    //send updated data
    res.status(StatusCodes.OK).json(await Payment.findOne({ where: { id: paymentID } }))
}

module.exports = {
    getPayments,
    makePayment
}