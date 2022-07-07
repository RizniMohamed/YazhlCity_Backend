const multer = require('multer');
const JWT = require('jsonwebtoken')
const path = require('path');
const { APIError } = require('./errorHandler');
const { StatusCodes } = require('http-status-codes');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.body.ImageFolder) {
            const folder = req.body.ImageFolder
            if (folder !== "room" && folder !== "user" && folder != "boarding")
                cb(new APIError("Invalid value for ImageFolder. provide user or room or boarding", StatusCodes.BAD_REQUEST))
            else
                cb(null, 'Storage/Image/' + folder)
        }
        else
            cb(new APIError("ImageFolder is not defined. provide user or room or boarding", StatusCodes.BAD_REQUEST))
    },
    filename: (req, file, cb) =>
        cb(null, Date.now() + Math.floor(Math.random() * 10000).toString() + path.extname(file.originalname))
})

module.exports = multer({ storage })