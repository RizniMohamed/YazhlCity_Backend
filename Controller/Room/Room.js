const { StatusCodes } = require("http-status-codes")
const { APIError } = require("../../Middleware/errorHandler")
const Boarding = require("../../Model/Boarding/Boarding")
const Facility = require("../../Model/Room/Facility")
const Room = require("../../Model/Room/Room")
const User = require("../../Model/User/User")
const findQueryLogic = require("../FindQueryLogic")

const createRoom = async (req, res) => {
    //filtering incoming data
    const { roomNumber, personCount, price, type, facilityID, boardingID, description } = req.body

    //validation
    if (!boardingID) throw new APIError("boardingID required", StatusCodes.BAD_REQUEST)
    const boarding = await Boarding.findOne({ where: { id: boardingID } })
    if (!boarding) throw new APIError("No boarding found", StatusCodes.NOT_FOUND)
    if (!req.file) throw new APIError("room image required", StatusCodes.BAD_REQUEST)

    // insert room
    const roomImage = process.env.SERVER_BASE_URL + req.file.path.split('\\').slice(1).join('/')
    const room = await Room.create({ room_number: roomNumber, image: roomImage, person_count: personCount, description: description, price: price, type: type, boardingID: boardingID })

    // insert facilities
    await room.addFacility(eval(facilityID))

    // send created room
    res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        data: await Room.findOne({
            where: { id: room.id },
            include: { model: Facility, attributes: ['id', 'name'] }
        })
    })
}

const updateRoom = async (req, res) => {
    //filtering incoming data
    const { personCount, price, type, roomID, description } = req.body

    //validation
    if (!roomID) throw new APIError("roomID required", StatusCodes.BAD_REQUEST)
    const room = await Room.findOne({ where: { id: roomID } })
    if (!room) throw new APIError("Room not found", StatusCodes.NOT_FOUND)

    // update room
    await Room.update(
        { person_count: personCount, price: price, type: type, description: description },
        { where: { id: roomID } }
    )

    //update room image
    if (req.file) {
        const roomImage = process.env.SERVER_BASE_URL + req.file.path.split('\\').slice(1).join('/')
        await Room.update({ image: roomImage }, { where: { id: roomID } })
    }

    // send updated room
    res.status(StatusCodes.CREATED).json({
        status: StatusCodes.OK,
        data: await Room.findOne({ where: { id: roomID } })
    })
}

const deleteRoom = async (req, res) => {
    //filtering incoming data
    const { roomID } = req.body

    //validation
    if (!roomID) throw new APIError("Room id required", StatusCodes.BAD_REQUEST)
    const deletedRoom = await Room.findOne({ where: { id: roomID } })
    if (!deletedRoom) throw new APIError("Room not found", StatusCodes.NOT_FOUND)

    //delete room
    await Room.destroy({ where: { id: roomID } });

    //send deleted room details
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: deletedRoom
    })
}

const getRooms = async (req, res) => {
    let { order, attributes, where } = findQueryLogic(req.query.where, req.query.order, req.query.select)

    const rooms = await Room.findAll({
        where,
        order: order ?? ['room_number'],
        attributes,
        include: { model: Facility, attributes: ['id', 'name'] }
    })

    if (rooms.length !== 0) {
        for (const room of rooms) {
            room.dataValues.occupaidCounts = await User.count({ where: { roomID: room.id } })
            room.dataValues.availability = room.dataValues.person_count === room.dataValues.occupaidCounts ? false : true
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: { count: rooms.length, rooms: rooms }
        })
    }
    else
        throw new APIError("No rooms found", StatusCodes.NOT_FOUND)
}

module.exports = {
    createRoom,
    updateRoom,
    deleteRoom,
    getRooms
}