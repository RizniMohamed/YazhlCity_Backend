const { StatusCodes } = require("http-status-codes")
const { JsonWebTokenError } = require("jsonwebtoken")
const { ValidationError } = require("sequelize")

class APIError extends Error {
    constructor(message, code) {
        super(message)
        this.code = code
    }
}


const errorHandler = (err, req, res, next) => {

    if (err instanceof JsonWebTokenError)
        return res.status(err.inner).json({ message: err.message })

    if (err instanceof ValidationError)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })

    if (err instanceof Error)
        return res.status(err.code).json({ message: err.message })



    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
}

module.exports = {errorHandler, APIError}