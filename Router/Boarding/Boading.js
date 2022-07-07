const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { createBoarding, getBoardings, deleteBoarding, updateBoarding } = require('../../Controller/Boarding/Boarding.js')
const upload = require('../../Middleware/storeImage')

router
    .route('/')
    .post(upload.array('image') ,createBoarding)
    .get(getBoardings)
    .delete(deleteBoarding)
    .patch(upload.array('image'),updateBoarding)


module.exports = router