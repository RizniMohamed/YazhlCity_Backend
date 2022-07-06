const { StatusCodes } = require('http-status-codes');
const { APIError } = require('../../Middleware/errorHandler')
const User = require('../../Model/User/User')
const Auth = require('../../Model/User/Auth')

const deleteUser = async (req, res) => {
    const { userID } = req.body
    const deletedUser = await User.findOne({ where: { id: userID } })
    if (deletedUser) {
        await User.destroy({ where: { id: userID } });
        res.status(StatusCodes.OK).json(deletedUser)
    } else {
        throw new APIError("User not found", StatusCodes.BAD_REQUEST)
    }
}

const getUsers = async (req, res) => {
    let order, attributes, where = {}
    if (req.query.where) {
        req.query.where.split(" ").map(data => {
            temp = data.split('-')
            where = { ...where, [temp[0]]: temp[1] }
        })
    }
    if (req.query.order) {
        order = [[
            req.query.order.startsWith('-') ? req.query.order.substring(1) : req.query.order,
            req.query.order.startsWith('-') ? 'DESC' : "ASC"
        ]]
    }
    if (req.query.select) attributes = req.query.select.split(" ")

    const users = await User.findAll({
        where,
        order,
        attributes,
        include: [{
            model: Auth,
            where,
            attributes: ['email']
        }]
    })

    if (users.length !== 0)
        res.status(StatusCodes.OK).json({ count: users.length, users })
    else
        res.status(StatusCodes.NOT_FOUND).json({ message: "No users found" })
}

const updateUser = async (req, res) => {
    const { userID, name, image, gender, adress, mobile, nic, roleID } = req.body
    if (userID) {
        await User.update({
            name,
            image: req.file.filename,
            gender,
            adress,
            mobile,
            nic,
            roleID
        }, { where: { id: userID } });
        res.status(StatusCodes.OK).json(await User.findOne({ where: { id: userID } }))
    }else{
        throw new APIError("User id is required", StatusCodes.BAD_REQUEST)
    }
}

module.exports = {
    deleteUser,
    getUsers,
    updateUser
}