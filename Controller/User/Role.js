const { StatusCodes } = require('http-status-codes')
const Role = require('../../Model/User/Role')
const { APIError } = require('../../Middleware/errorHandler')

const getRoles = async (req, res) => {
    const allRoles = await Role.findAll()
    if (allRoles)
        res.status(StatusCodes.OK).json(allRoles)
    else
        throw new APIError("No roles found", StatusCodes.NOT_FOUND)
}

module.exports = {
    getRoles
}