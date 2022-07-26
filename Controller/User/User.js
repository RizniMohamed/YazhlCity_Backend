const { StatusCodes } = require('http-status-codes');
const { APIError } = require('../../Middleware/errorHandler')
const User = require('../../Model/User/User')
const Auth = require('../../Model/User/Auth');
const Role = require('../../Model/User/Role');
const Payment = require('../../Model/Payment/Payment')
const findQueryLogic = require('../FindQueryLogic');
const Room = require('../../Model/Room/Room');


const register = async (req, res) => {
    //filtering incoming data
    const { email, password, name } = req.body

    //create user
    const { id: userID } = await User.create({ name: name })

    try {
        //create auth for created user
        const newAuth = await Auth.create({ email: email, password: password, userID: userID })
        //send created user details
        res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED, data: { email, name, role: "user" } })
    } catch (error) {
        //if error on auth creation, delete created user
        await User.destroy({ where: { id: userID } })
        //send error message
        throw new APIError(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteUser = async (req, res) => {
    //filtering incoming data
    const { userID } = req.body

    //validation
    if (!userID) throw new APIError("User id required", StatusCodes.BAD_REQUEST)
    const deletedUser = await User.findOne({ where: { id: userID } })
    if (!deletedUser) throw new APIError("User not found", StatusCodes.NOT_FOUND)

    //delete user
    await User.destroy({ where: { id: userID } });

    //send deleted user details
    res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: deletedUser })
}

const getUsers = async (req, res) => {
    let { order, attributes, where } = findQueryLogic(req.query.where, req.query.order, req.query.select)

    const users = await User.findAll({
        where,
        order: order ?? ['id'],
        attributes,
        include: [
            { model: Auth, attributes: ['email'] },
            { model: Role, attributes: ['name'] },
            { model: Payment },
        ]
    })

    if (users.length !== 0)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: { count: users.length, users } })
    else
        throw new APIError("No users found", StatusCodes.NOT_FOUND)
}

const updateUser = async (req, res) => {
    //filtering incoming data
    const { userID, name, gender, address, mobile, nic } = req.body

    //validation
    if (!userID) throw new APIError("userID is required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("User not found", StatusCodes.NOT_FOUND)

    //update user
    await User.update(
        { name: name, gender: gender, address: address, mobile: mobile, nic: nic },
        { where: { id: userID } }
    );

    console.log(a);

    //update user image 
    if (req.file) {
        let userImage = process.env.SERVER_BASE_URL + req.file.path.split('\\').slice(1).join('/')
        await User.update({ image: userImage }, { where: { id: userID } });
    }


    //send updated data
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: await User.findOne({ where: { id: userID } })
    })
}

module.exports = {
    deleteUser,
    getUsers,
    updateUser,
    register
}