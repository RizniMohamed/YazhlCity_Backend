const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { register, login, updateAuth } = require('../../Controller/User/Auth')

router
    .route('/password')
    .patch(updateAuth)
router
    .route('/login')
    .post(login)
router
    .route('/register')
    .post(register)

module.exports = router