const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { createBoarding, getBoardings, deleteBoarding, updateBoarding } = require('../../Controller/Boarding/Boarding.js')
const { APIError } = require('../../Middleware/errorHandler')
const { StatusCodes } = require('http-status-codes')
const upload = require('../../Middleware/storeImage').fields([{ name: "boardingImages" }, { name: "washroomImage" }, { name: "bathroomImage" }])

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
    .post(uploadMiddleware, createBoarding)
    .get(getBoardings)
    .patch(uploadMiddleware, updateBoarding)
    .delete(deleteBoarding)
    
module.exports = router