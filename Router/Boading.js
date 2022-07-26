const router = require('express').Router()
const auth = require('../Middleware/auth')
const { createBoarding, getBoardings, deleteBoarding, updateBoarding } = require('../Controller/Boarding/Boarding.js')
const { StatusCodes } = require('http-status-codes')
const { getLocations } = require('../Controller/Boarding/Location')
const upload = require('../Middleware/storeImage')

const uploadMiddleware = (req, res, next) => {
    upload.fields([{ name: "boardingImages" }, { name: "washroomImage" }, { name: "bathroomImage" }])(req, res, (err) => {
        if (err) {
            const msg = `${err.message} ${err.field}. Expected boardingImages or washroomImage or bathroomImage`
            console.log(msg);
            return res.status(StatusCodes.OK).json({ status: StatusCodes.BAD_REQUEST, data: msg })
        }
        else { next() }
    })
}

router
    .route('/')
    .post(uploadMiddleware, createBoarding)
    .get(getBoardings)
    .patch(auth, uploadMiddleware, updateBoarding)
    .delete(auth, deleteBoarding)

router
    .route('/location')
    .get(getLocations)


module.exports = router