const { StatusCodes } = require("http-status-codes")
const { APIError } = require("../../Middleware/errorHandler")
const Notification = require("../../Model/Notification/Notification")
const User_Notification = require("../../Model/Notification/User_Notification")
const User = require("../../Model/User/User")
const findQueryLogic = require("../FindQueryLogic")

const createNotification = async (req, res) => {

    //filtering incoming data
    const { message, userID, to } = req.body

    //validation
    if (!userID) throw new APIError("UserID required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("No user found", StatusCodes.NOT_FOUND)

    // insert notification
    const notification = await Notification.create({ message: message, from: userID })
    await notification.addUser(eval(to))

    // send created room
    res.status(StatusCodes.CREATED).json(
        await Notification.findOne({
            where: { id: notification.id },
            include: { model: User }
        })
    )

}


const deleteNotification = async (req, res) => {
    //filtering incoming data
    const { notificationID } = req.body

    //validation
    if (!notificationID) throw new APIError("notificationID required", StatusCodes.BAD_REQUEST)
    const notification = await Boarding.findOne({ where: { id: notificationID } })
    if (!notification) throw new APIError("notification not found", StatusCodes.NOT_FOUND)

    // delete boarding
    await Notification.destroy({ where: { id: notificationID } });

    //send deleted boarding
    res.status(StatusCodes.OK).json(notification)
}

const getNotifications = async (req, res) => {
    let { order, attributes, where } = findQueryLogic(req.query.where, req.query.order, req.query.select)

    const notifications = await Notification.findAll({
        where,
        order,
        attributes,
        include: [{ model: User }]
    })

    if (notifications.length !== 0)
        res.status(StatusCodes.OK).json({ count: notifications.length, notifications })
    else
        throw new APIError("No notifications found", StatusCodes.NOT_FOUND)
}

const getUnreadNotifications = async (req, res) => {
    const { userID } = req.body

    //validation
    if (!userID) throw new APIError("userID required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("user not found", StatusCodes.NOT_FOUND)

    //get unread notificcations
    let notifications = []
    const notification_IDs = await User_Notification.findAll({ where: { UserId: userID, status: false } })
    for (const { NotificationId } of notification_IDs) {
        const notification = await Notification.findOne({ where: { id: NotificationId } })
        notifications.push(notification)
    }

    if (notifications.length !== 0)
        res.status(StatusCodes.OK).json({ count: notifications.length, notifications: notifications })
    else
        throw new APIError("No notifications found", StatusCodes.NOT_FOUND)
}


const notificationRead = async (req, res) => {
    //filtering incoming data
    const { notificationID, userID } = req.body

    //validation
    if (!notificationID) throw new APIError("notificationID required", StatusCodes.BAD_REQUEST)
    const notification = await Notification.findOne({ where: { id: notificationID } })
    if (!notification) throw new APIError("Notification not found", StatusCodes.NOT_FOUND)
    if (!userID) throw new APIError("userID required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("User not found", StatusCodes.NOT_FOUND)

    //update notification status for a user
    await User_Notification.update(
        { status: true },
        { where: { NotificationId: notificationID, UserId: userID } }
    )

    // send updated boarding
    res.status(StatusCodes.CREATED).json({ message: "Notification read" })
}


const updateNotification = async (req, res) => {

    //filtering incoming data
    const { message, userID, to, notificationID } = req.body

    //validation
    if (!userID) throw new APIError("UserID required", StatusCodes.BAD_REQUEST)
    const user = await User.findOne({ where: { id: userID } })
    if (!user) throw new APIError("No user found", StatusCodes.NOT_FOUND)
    if (!notificationID) throw new APIError("notificationID required", StatusCodes.BAD_REQUEST)
    const notification_old = await Notification.findOne({ where: { id: notificationID } })
    if (!notification_old) throw new APIError("No notification found", StatusCodes.NOT_FOUND)

    if (message) notification_old.message = message

    // delete notification
    await Notification.destroy({ where: { id: notification_old.id } })
    // insert notification
    const notification = await Notification.create({ id: notification_old.id, message: notification_old.message, from: userID })
    await notification.addUser(eval(to))

    // send created room
    res.status(StatusCodes.OK).json(
        await Notification.findOne({
            where: { id: notification.id },
        })
    )
}

module.exports = {
    createNotification,
    deleteNotification,
    getNotifications,
    notificationRead,
    getUnreadNotifications,
    updateNotification
}