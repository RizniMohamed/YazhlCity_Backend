const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../../Middleware/errorHandler')
const Payment = require('../../Model/Payment/Payment')
const PaymentType = require('../../Model/Payment/PaymentType')
const User = require('../../Model/User/User')
const findQueryLogic = require('../FindQueryLogic')
const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);
const { v4: uuidv4 } = require('uuid');

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
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: { count: payments.length, payments }
        })
    else
        throw new APIError("No payments found", StatusCodes.NOT_FOUND)
}


const makePayment = async (req, res) => {
    //filtering incoming data
    const { paymentTypeID, paymentID, stripeToken, userID } = req.body

    //validation
    if (!paymentTypeID) throw new APIError("paymentTypeID is required", StatusCodes.BAD_REQUEST)
    const paymentType = await PaymentType.findOne({ where: { id: paymentTypeID } })
    if (!paymentType) throw new APIError("paymentType not found", StatusCodes.NOT_FOUND)
    if (!paymentID) throw new APIError("paymentID is required", StatusCodes.BAD_REQUEST)
    if (!stripeToken) throw new APIError("Token is required", StatusCodes.BAD_REQUEST)
    const payment = await Payment.findOne({ where: { id: paymentID } })
    if (!payment) throw new APIError("payment not found", StatusCodes.NOT_FOUND)

    // Stripe implementation
    const customer = await stripe.customers.create({
        email: stripeToken.email,
        source: stripeToken.id
    })

    const paymentStripe = await stripe.paymentIntents.create({
        amount: payment.amount * 100,
        currency: 'LKR',
        customer: customer.id,
        receipt_email: stripeToken.email
    }, {
        idempotencyKey: uuidv4()
    })

    if (paymentStripe) {
        //update payment
        await Payment.update(
            { paymentTypeID: paymentTypeID, status: true },
            { where: { id: paymentID } }
        );

        //update user active status
        const payments = await Payment.findAll({ where: { userID: payment.userID } })
        let counter = 0
        payments.forEach(payment => (payment.status == false) ? counter += 1 : null)
        if (counter < 2) await User.update({ active: true }, { where: { id: payment.userID } })

        //send updated data
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: await Payment.findOne({ where: { id: paymentID } })
        })
    } else {
        throw new APIError("Payment failed", StatusCodes.BAD_REQUEST);
    }

}

module.exports = {
    getPayments,
    makePayment
}