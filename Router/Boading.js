const router = require('express').Router()
const auth = require('../Middleware/auth')
const { createBoarding, getBoardings, deleteBoarding, updateBoarding } = require('../Controller/Boarding/Boarding.js')
const { StatusCodes } = require('http-status-codes')
const { getLocations } = require('../Controller/Boarding/Location')
const upload = require('../Middleware/storeImage').fields([{ name: "boardingImages" }, { name: "washroomImage" }, { name: "bathroomImage" }])

const uploadMiddleware = (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            console.log("**************************");
            console.log(err.message, err.field);
            return res.status(StatusCodes.OK).json(`${err.message} ${err.field}. Expected boardingImages or washroomImage or bathroomImage`)
        }
        else{
            console.log("----------------------------");
            next()

        }
    })
}

router
    .route('/')
    .post( uploadMiddleware, createBoarding)
    .get(getBoardings)
    .patch(auth, uploadMiddleware, updateBoarding)
    .delete(auth, deleteBoarding)

router
    .route('/location')
    .get(getLocations)


module.exports = router