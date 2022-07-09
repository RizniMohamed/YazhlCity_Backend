const { StatusCodes } = require("http-status-codes")
const { APIError } = require('../../Middleware/errorHandler')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const Auth = require("../../Model/User/Auth")
const User = require("../../Model/User/User")
const Role = require("../../Model/User/Role")

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
    const token = JWT.sign(loginDetails, process.env.JWT_SECRET, { expiresIn: "1d" })
    loginDetails.token = token

    //send logged in user details
    res.status(StatusCodes.OK).json(loginDetails)
}


const updateAuth = async (req, res) => {
    //filtering incoming data
    const { userID, password } = req.body
    //validation
    if (!userID) throw new APIError("UserID cannot be empty", StatusCodes.BAD_REQUEST)
    //update user
    await Auth.update({ password }, { where: { userID } });
    //send updated details
    res.status(StatusCodes.OK).json(await Auth.findOne({ message : "Password updated"}))
}

module.exports = {
    login,
    updateAuth,
}