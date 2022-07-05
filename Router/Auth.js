const router = require('express').Router()
const auth = require('../Middleware/auth')
const { createAuth, login, updateAuth, deleteAuth } = require('../Controller/Auth')

router
    .route('/')
    .post(createAuth)
    .patch(updateAuth)   // not tested
    .delete(deleteAuth)  // not tested
router
    .route('/login')
    .post(login)

module.exports = router