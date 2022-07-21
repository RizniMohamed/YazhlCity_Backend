const { StatusCodes } = require('http-status-codes')
const Role = require('../../Model/User/Role')
const { APIError } = require('../../Middleware/errorHandler')

const getRoles = async (req, res) => {
    const allRoles = await Role.findAll({ order: ['id'] })
    if (allRoles.length !== 0)
        res.status(StatusCodes.OK).json({status : StatusCodes.OK, data : allRoles})
    else
        throw new APIError("No roles found", StatusCodes.NOT_FOUND)
}

module.exports = {
    getRoles
}