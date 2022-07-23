const router = require('express').Router()
const auth = require('../Middleware/auth')
const { StatusCodes } = require('http-status-codes')
const { getFacilities } = require('../Controller/Room/Facility')
const { createRoom, updateRoom, deleteRoom, getRooms } = require('../Controller/Room/Room')
const upload = require('../Middleware/storeImage').single('image')

const uploadMiddleware = (req, res, next) => {
    upload(req, res, err => {
        if (err)
            res.status(StatusCodes.BAD_REQUEST).send(`${err.message} ${err.field}. Expected image`)
        else
            next()
    })
}

router
    .route('/')
    .post(auth, uploadMiddleware, createRoom)
    .patch(auth, uploadMiddleware, updateRoom)
    .delete(auth, deleteRoom)
    .get(auth, getRooms)

router
    .route('/facility')
    .get(getFacilities)

module.exports = router