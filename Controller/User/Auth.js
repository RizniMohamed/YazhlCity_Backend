const { StatusCodes } = require("http-status-codes")
const { APIError } = require('../../Middleware/errorHandler')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const Auth = require("../../Model/User/Auth")
const User = require("../../Model/User/User")
const Role = require("../../Model/User/Role")

const login = async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        const auth = await Auth.findOne({ where: { email } })

        if (!auth) throw new APIError("No user found", StatusCodes.NOT_FOUND)
        const isPasswordValid = bcrypt.compareSync(password, auth.password)
        if (!isPasswordValid) throw new APIError("Invalid password", StatusCodes.UNAUTHORIZED)

        const user = await User.findOne({ where: { id: auth.userID } })
        const role = await Role.findOne({ where: { id: user.roleID } })

        const loginDetails = { userID: auth.userID, email, role: role.name }
        const token = JWT.sign(loginDetails, process.env.JWT_SECRET, { expiresIn: "1d" })
        loginDetails.token = token
        res.status(StatusCodes.OK).json(loginDetails)
    }else{
        throw new APIError("Username and password cannot be empty",StatusCodes.BAD_REQUEST)
    }
}

const register = async (req, res) => {
    const { email, password, name } = req.body
    const { id: userID } = await User.create({ name })
    const newAuth = await Auth.create({ email, password, userID })
    res.status(StatusCodes.CREATED).json(newAuth)
}

const updateAuth = async (req, res) => {
    const { userID, password } = req.body
    if(userID){
        await Auth.update({ password }, { where: { userID } });
        res.status(StatusCodes.OK).json(await Auth.findOne({ where: { userID } }))
    }else{
        throw new APIError("UserID cannot be empty", StatusCodes.BAD_REQUEST)
    }
}

module.exports = {
    register,
    login,
    updateAuth,
}