const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../../Middleware/errorHandler')
const PaymentType = require('../../Model/Payment/PaymentType')

const getPaymentTypes = async (req, res) => {
    const paymentTypes = await PaymentType.findAll({ order: ['id'] })
    if (paymentTypes.length !== 0)
        res.status(StatusCodes.OK).json({ count: paymentTypes.length, paymentTypes })
    else
        throw new APIError("No payment types found", StatusCodes.NOT_FOUND)
}

module.exports = {
    getPaymentTypes
}

