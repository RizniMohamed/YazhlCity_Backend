const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../../Middleware/errorHandler')
const Boarding = require('../../Model/Boarding/Boarding')
const User = require('../../Model/User/User')
const Location = require('../../Model/Boarding/Location')
const Auth = require('../../Model/User/Auth')
const Role = require('../../Model/User/Role')
const BoardingImage = require('../../Model/Boarding/BoardingImage')
const Washroom = require('../../Model/Boarding/Washroom')
const Bathroom = require('../../Model/Boarding/Bathroom')
const Payment = require('../../Model/Payment/Payment')
const findQueryLogic = require('../FindQueryLogic')

const createBoarding = async (req, res) => {
    //filtering incoming data
    const { name, mobile, address, roomType, description, gender, geoloc, locationID, userID, washroomCount, washroomDesc, bathroomCount, bathroomDesc } = req.body

    //validation
    if (!userID) throw new APIError("UserID required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("No user found", StatusCodes.NOT_FOUND)
    if (!req.files.boardingImages) throw new APIError("boarding images required", StatusCodes.BAD_REQUEST)
    if (!req.files.washroomImage) throw new APIError("washroom image required", StatusCodes.BAD_REQUEST)
    if (!req.files.bathroomImage) throw new APIError("bathroom image required", StatusCodes.BAD_REQUEST)

    // insert boarding
    const boarding = await Boarding.create({ name: name, mobile: eval(mobile), address: address, roomType: roomType, description: description, gender: gender, geoloc: eval(geoloc), locationID: locationID, userID: userID })

    // insert boarding images
    const boardingImages = req.files.boardingImages.map(file => file.path.split('\\').slice(1).join('/'))
    boardingImages.forEach(async image => await BoardingImage.create({ image: image, boardingID: boarding.id }))

    //insert washroom
    const washroomImage = req.files.washroomImage[0].path.split('\\').slice(1).join('/')
    await Washroom.create({ count: washroomCount, description: washroomDesc, image: washroomImage, boardingID: boarding.id })

    //insert bathroom
    const bathroomImage = req.files.bathroomImage[0].path.split('\\').slice(1).join('/')
    await Bathroom.create({ count: bathroomCount, description: bathroomDesc, image: bathroomImage, boardingID: boarding.id })

    // promote user to manager
    await User.update({ roleID: 2 }, { where: { id: userID } })

    //create manager first payment
    await Payment.create({ amount: process.env.MANAGER_FEE, userID: userID })

    // send created boarding
    res.status(StatusCodes.CREATED).json(
        await Boarding.findOne({
            where: { id: boarding.id },
            include: [
                { model: Location, attributes: ['name'] },
                { model: User, include: [{ model: Role, attributes: ['name'] }, { model: Auth, attributes: ['email'] },] },
                { model: BoardingImage, attributes: ['image'] },
                { model: Washroom, attributes: ['image', "count", "description"] },
                { model: Bathroom, attributes: ['image', "count", "description"] },
            ]
        })
    )
}

const getBoardings = async (req, res) => {
    let {order, attributes, where} = findQueryLogic(req.query.where,req.query.order,req.query.select)

    const boardings = await Boarding.findAll({
        where,
        order: order ??  ['updatedAt'],
        attributes,
        include: [
            { model: Location, attributes: ['name'] },
            { model: User, include: [{ model: Role, attributes: ['name'] }, { model: Auth, attributes: ['email'] },] },
            { model: BoardingImage, attributes: ['image'] }
        ]
    })

    if (boardings.length !== 0)
        res.status(StatusCodes.OK).json({ count: boardings.length, boardings })
    else
        throw new APIError("No boardings found", StatusCodes.NOT_FOUND)
}

const deleteBoarding = async (req, res) => {
    //filtering incoming data
    const { boardingID } = req.body

    //validation
    if (!boardingID) throw new APIError("boarding id required", StatusCodes.BAD_REQUEST)
    const deletedboarding = await Boarding.findOne({ where: { id: boardingID } })
    if (!deletedboarding) throw new APIError("Boarding not found", StatusCodes.NOT_FOUND)

    // delete boarding
    await Boarding.destroy({ where: { id: boardingID } });

    //demote manager to user
    await User.update({ roleID: 4 }, { where: { id: deletedboarding.userID } })

    //send deleted boarding
    res.status(StatusCodes.OK).json(deletedboarding)
}

const updateBoarding = async (req, res) => {
    //filtering incoming data
    const { name, mobile, address, roomType, description, gender, geoloc, locationID, rating, verfied, boardingID, washroomCount, washroomDesc, bathroomCount, bathroomDesc } = req.body

    //validation
    if (!boardingID) throw new APIError("boarding id required", StatusCodes.BAD_REQUEST)
    if (!(eval(geoloc) instanceof Array)) throw new APIError("Geo location is need to be an array of two double values", StatusCodes.BAD_REQUEST)
    const boarding = await Boarding.findOne({ where: { id: boardingID } })
    if (!boarding) throw new APIError("Boarding not found", StatusCodes.NOT_FOUND)

    //update boarding
    await Boarding.update(
        { name, mobile: eval(mobile), address, roomType, description, gender, geoloc: eval(geoloc), locationID, rating, verfied, boardingID },
        { where: { id: boardingID } }
    )

    //update washroom 
    await Washroom.update(
        { count: washroomCount, description: washroomDesc },
        { where: { boardingID } }
    )

    //update bathroom 
    await Bathroom.update(
        { count: bathroomCount, description: bathroomDesc },
        { where: { boardingID } }
    )

    //update boarding images
    if (req.files.boardingImages) {
        const boardingImages = req.files.boardingImages.map(file => file.path.split('\\').slice(1).join('/'))
        await boardingImages.forEach(async image => {
            await BoardingImage.destroy({ where: { boardingID } })
            await BoardingImage.create({ image, boardingID })
        })
    }

    //update washroom image
    if (req.files.washroomImage) {
        const washroomImage = req.files.washroomImage[0].path.split('\\').slice(1).join('/')
        await Washroom.update({ image: washroomImage }, { where: { boardingID } })
    }

    //update bathroom image
    if (req.files.bathroomImage) {
        const bathroomImage = req.files.bathroomImage[0].path.split('\\').slice(1).join('/')
        await Bathroom.update({ image: bathroomImage }, { where: { boardingID } })
    }

    // send updated boarding
    res.status(StatusCodes.CREATED).json(
        await Boarding.findOne({
            where: { id: boardingID },
            include: [
                { model: Location, attributes: ['name'] },
                { model: User, include: [{ model: Role, attributes: ['name'] }, { model: Auth, attributes: ['email'] },] },
                { model: BoardingImage, attributes: ['image'] },
                { model: Washroom, attributes: ['image', "count", "description"] },
                { model: Bathroom, attributes: ['image', "count", "description"] },
            ]
        })
    )
}

module.exports = {
    createBoarding,
    getBoardings,
    deleteBoarding,
    updateBoarding
}