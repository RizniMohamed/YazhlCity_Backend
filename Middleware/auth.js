const { StatusCodes } = require("http-status-codes")
const JWT = require("jsonwebtoken")
const authorization = async (req, res, next) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer "))
        throw new JWT.JsonWebTokenError("No web token provided", StatusCodes.UNAUTHORIZED)

    try {
        const token = header.split(' ')[1]
        JWT.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        throw new JWT.JsonWebTokenError("Invalid token", StatusCodes.UNAUTHORIZED)
    }
}

module.exports = authorization