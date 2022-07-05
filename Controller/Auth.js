const { StatusCodes } = require("http-status-codes")
const Auth = require("../Model/User/Auth")
const { APIError } = require('../Middleware/errorHandler')
const bcrypt = require('bcryptjs')

const createAuth = async (req, res) => {
    const { email, password } = req.body
    const newAuth = await Auth.create({ email, password })
    res.status(StatusCodes.CREATED).json(newAuth)
}

const login = async (req, res) => {
    const { email, password } = req.body
    const auth = await Auth.findOne({ where: { email } })

    if (!auth) throw new APIError("No user found", StatusCodes.NOT_FOUND)
    const isPasswordValid = bcrypt.compareSync(password, auth.password)
    if (!isPasswordValid) throw new APIError("Invalid password", StatusCodes.UNAUTHORIZED)

    //send token + userid + roleId
    //const token = JWT.sign({ id: 2, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(StatusCodes.OK).json({ message: "valid" })
}

const updateAuth = async (req, res) => {
    const { userID, password } = req.body
    await Auth.update(password, { where: userID });
    res.status(StatusCodes.OK).json(await Auth.findOne({ where: userID }))
}

const deleteAuth = async (req, res) => {
    const { userID } = req.body
    const deletedAuth = await user.findOne({ where: userID })
    if (deletedAuth) {
        await user.destroy({ where: userID });
        res.status(StatusCodes.OK).json(deletedAuth)
    } else {
        throw new APIError("Auth not found", StatusCodes.BAD_REQUEST)
    }
}


module.exports = {
    createAuth,
    login,
    updateAuth,
    deleteAuth
}