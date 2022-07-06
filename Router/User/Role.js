const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { getRoles } = require('../../Controller/User/Role')

router
    .route('/')
    .get(getRoles)

module.exports = router