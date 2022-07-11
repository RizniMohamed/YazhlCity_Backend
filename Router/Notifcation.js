const router = require('express').Router()
const auth = require('../Middleware/auth')
const { createNotification, deleteNotification, getNotifications, notificationRead, getUnreadNotifications, updateNotification } = require('../Controller/Notification/Notification')

router
    .route('/')
    .get(auth, getNotifications)
    .post(auth, createNotification)
    .delete(auth, deleteNotification)
    .patch(auth,updateNotification)

router
    .route('/read')
    .post(auth, notificationRead)

router
    .route('/unread')
    .get(auth, getUnreadNotifications)

module.exports = router