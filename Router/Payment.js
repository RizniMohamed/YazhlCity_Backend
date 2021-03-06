const router = require('express').Router()
const { getPayments, makePayment } = require('../Controller/Payment/Payment')
const { getPaymentTypes } = require('../Controller/Payment/PaymentType')
const auth = require('../Middleware/auth')

router
    .route('/')
    .get(auth,getPayments)
    .post(auth,makePayment)

router
    .route('/type')
    .get(getPaymentTypes)

module.exports = router