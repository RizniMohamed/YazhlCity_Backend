const { StatusCodes } = require('http-status-codes')
const Location = require('../../Model/Boarding/Location')
const { APIError } = require('../../Middleware/errorHandler')

const getLocations = async (req, res) => {
    const locations = await Location.findAll()
    if (locations)
        res.status(StatusCodes.OK).json({count : locations.length ,locations})
    else
        throw new APIError("No loocations found", StatusCodes.NOT_FOUND)
}

module.exports = {
    getLocations
}