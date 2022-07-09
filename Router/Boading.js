const router = require('express').Router()
const auth = require('../Middleware/auth')
const { createBoarding, getBoardings, deleteBoarding, updateBoarding } = require('../Controller/Boarding/Boarding.js')
const { StatusCodes } = require('http-status-codes')
const { getLocations } = require('../Controller/Boarding/Location')
const upload = require('../Middleware/storeImage').fields([{ name: "boardingImages" }, { name: "washroomImage" }, { name: "bathroomImage" }])

const uploadMiddleware = (req, res, next) => {
    upload(req, res, err => {
        if (err)
            res.status(StatusCodes.BAD_REQUEST).send(`${err.message} ${err.field}. Expected boardingImages or washroomImage or bathroomImage`)
        else
            next()
    })
}

router
    .route('/')
    .post(auth,uploadMiddleware, createBoarding)
    .get(getBoardings)
    .patch(auth,uploadMiddleware, updateBoarding)
    .delete(auth,deleteBoarding)

router
    .route('/location')
    .get(getLocations)

    
module.exports = router