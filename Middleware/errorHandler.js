const { StatusCodes } = require("http-status-codes")
const { JsonWebTokenError } = require("jsonwebtoken")
const { MulterError } = require("multer")
const { ValidationError } = require("sequelize")

class APIError extends Error {
    constructor(message, code) {
        super(message)
        this.code = code
    }
}

const errorHandler = (err, req, res, next) => {

    if (err instanceof JsonWebTokenError)
        return res.status(err.inner).json({ status: err.inner, data: err.message })

    if (err instanceof MulterError)
        return res.status(StatusCodes.OK).json({ status: StatusCodes.BAD_REQUEST, data: err.message })

    if (err instanceof ValidationError)
        return res.status(StatusCodes.OK).json({ status: StatusCodes.BAD_REQUEST, data: err.message })

    if (err instanceof Error)
        return res.status(StatusCodes.OK).json({ status: err.code, data: err.message })

    return res.status(StatusCodes.OK).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, data: err.message })
}

module.exports = {errorHandler, APIError}