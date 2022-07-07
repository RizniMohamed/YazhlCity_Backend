const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { getLocations } = require('../../Controller/Boarding/Location')

router
    .route('/')
    .get(getLocations)


module.exports = router