const { StatusCodes } = require("http-status-codes")
const { APIError } = require('../../Middleware/errorHandler')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const Auth = require("../../Model/User/Auth")
const User = require("../../Model/User/User")
const Role = require("../../Model/User/Role")
const findQueryLogic = require("../FindQueryLogic")

const login = async (req, res) => {
    //filtering incoming data
    const { email, password } = req.body

    //validation
    if (!email) throw new APIError("Email cannot be empty", StatusCodes.BAD_REQUEST)
    if (!password) throw new APIError("Password cannot be empty", StatusCodes.BAD_REQUEST)
    const auth = await Auth.findOne({ where: { email } })
    if (!auth) throw new APIError("No user found", StatusCodes.NOT_FOUND)
    const isPasswordValid = bcrypt.compareSync(password, auth.password)
    if (!isPasswordValid) throw new APIError("Invalid password", StatusCodes.UNAUTHORIZED)

    // get logged in user details
    const user = await User.findOne({ where: { id: auth.userID } })
    const role = await Role.findOne({ where: { id: user.roleID } })
    const loginDetails = { userID: auth.userID, email, role: role.name }

    //generate JWT token
    const token = JWT.sign(loginDetails, process.env.JWT_SECRET, { expiresIn: "1m" })
    loginDetails.token = token

    //send logged in user details
    res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: loginDetails })
}


const updateAuth = async (req, res) => {
    //filtering incoming data
    const { userID, password } = req.body
    //validation
    if (!userID) throw new APIError("UserID cannot be empty", StatusCodes.BAD_REQUEST)
    //update user
    await Auth.update({ password }, { where: { userID } });
    //send updated details
    res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: await Auth.findOne({ message: "Password updated" }) })
}

const refreshToken = async (req, res) => {
    try {
        // check token and get that expired token 
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
        // if token not available send error
        if (!token) {
            throw new JWT.JsonWebTokenError("No web token provided", StatusCodes.UNAUTHORIZED);
        }
        // check correct token
        const expiredPayload = JWT.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        // generate new token
        let loginDetails = { userID: expiredPayload.userID, email: expiredPayload.email, role: expiredPayload.name };
        const newToken = JWT.sign(loginDetails, process.env.JWT_SECRET, { expiresIn: "1m" });
        loginDetails.token = newToken;

        //send logged in user details
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: loginDetails })

    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ data: error.message })
    }
}


const verifyEmail = async (req, res) => {
    const { email } = req.body

    if (!email) throw new APIError("Email required", StatusCodes.BAD_REQUEST)

    const user = await Auth.findOne({
        where: { email: email }
    })

    if (user)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: { user } })
    else
        throw new APIError("No users found", StatusCodes.NOT_FOUND)
}

const getAuths = async (req, res) => {
    let { order, attributes, where } = findQueryLogic(req.query.where, req.query.order, req.query.select)

    const users = await Auth.findAll({
        where,
        order: order ?? ['id'],
        attributes,
    })

    if (users.length !== 0)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: { count: users.length, users } })
    else
        throw new APIError("No users found", StatusCodes.NOT_FOUND)
}



module.exports = {
    login,
    updateAuth,
    refreshToken,
    verifyEmail,
    getAuths
}