const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../../Middleware/errorHandler')
const Boarding = require('../../Model/Boarding/Boarding')
const User = require('../../Model/User/User')
const Location = require('../../Model/Boarding/Location')
const Auth = require('../../Model/User/Auth')
const Role = require('../../Model/User/Role')
const BoardingImage = require('../../Model/Boarding/Image')

const createBoarding = async (req, res) => {
    const { name, mobile, address, roomType, description, gender, orginality, geoloc, locationID, userID } = req.body
    if (userID) {
        const user = await User.findOne({ where: { id: userID } })
        if (user) {
            if (req.files.length !== 0){
                const boarding = await Boarding.create({ name, mobile: eval(mobile), address, roomType, description, gender, orginality, geoloc: eval(geoloc), locationID, userID })
                const images = req.files.map(file => file.path.split('\\').slice(1).join('/'))
                images.forEach(async image => await BoardingImage.create({ image, boardingID: boarding.id }))
                await User.update({ roleID: 2 }, { where: { id: userID } })
                res.status(StatusCodes.CREATED).json(boarding)
            }else{
                throw new APIError("images required", StatusCodes.BAD_REQUEST)
            }
        } else {
            throw new APIError("No user found", StatusCodes.NOT_FOUND)
        }
    } else {
        throw new APIError("UserID required", StatusCodes.BAD_REQUEST)
    }
}


const getBoardings = async (req, res) => {
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

    const boardings = await Boarding.findAll({
        where,
        order,
        attributes,
        include: [
            { model: Location, attributes: ['name'] },
            { model: User, include: [{ model: Role, attributes: ['name'] }, { model: Auth, attributes: ['email'] },] },
            { model: BoardingImage , attributes : ['image']}
        ]
    })

    if (boardings.length !== 0)
        res.status(StatusCodes.OK).json({ count: boardings.length, boardings })
    else
        res.status(StatusCodes.NOT_FOUND).json({ message: "No boardings found" })
}

const deleteBoarding = async (req, res) => {
    const { boardingID } = req.body
    if (boardingID) {
        const deletedboarding = await Boarding.findOne({ where: { id: boardingID } })
        if (deletedboarding) {
            await Boarding.destroy({ where: { id: boardingID } });
            await User.update({ roleID: 4 }, { where: { id: deletedboarding.userID } })
            res.status(StatusCodes.OK).json(deletedboarding)
        } else {
            throw new APIError("Boarding not found", StatusCodes.NOT_FOUND)
        }
        throw new APIError("boarding id required", StatusCodes.BAD_REQUEST)
    }
}

const updateBoarding = async (req, res) => {
    const { name, mobile, address, roomType, description, gender, orginality, geoloc, locationID, rating, verfied, boardingID } = req.body
    if (boardingID && eval(geoloc) instanceof Array) {
        const boarding = await Boarding.findOne({ where: { id: boardingID } })
        const images = req.files.map(file => file.path.split('\\').slice(1).join('/'))
        if (boarding) {
            await Boarding.update({
                name,
                mobile,
                address,
                roomType,
                description,
                gender,
                orginality,
                geoloc: eval(geoloc),
                locationID,
                rating,
                verfied,
                boardingID
            }, { where: { id: boardingID } });

            images.forEach(async image => {
                await BoardingImage.destroy({ where: { boardingID } })
                await BoardingImage.create({ image, boardingID })
            })
            res.status(StatusCodes.OK).json(await Boarding.findOne({ where: { id: boardingID } }))
        }
        else
            throw new APIError("Boarding not found", StatusCodes.NOT_FOUND)
    } else {
        throw new APIError("boarding id is required & geo location is need to be an array of two double values", StatusCodes.BAD_REQUEST)
    }
}

module.exports = {
    createBoarding,
    getBoardings,
    deleteBoarding,
    updateBoarding
}