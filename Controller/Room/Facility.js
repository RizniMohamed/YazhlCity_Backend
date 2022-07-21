const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../../Middleware/errorHandler')
const Facility = require('../../Model/Room/Facility')

const getFacilities = async (req, res) => {
    const facilities = await Facility.findAll({order : ['id']})
    if (facilities.length !== 0)
        res.status(StatusCodes.OK).json({
            status : StatusCodes.OK,
            data: facilities
        })
    else
        throw new APIError("No facilities found", StatusCodes.NOT_FOUND)
}

module.exports = {
    getFacilities
}