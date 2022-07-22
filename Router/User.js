const router = require('express').Router()
const auth = require('../Middleware/auth')
const { StatusCodes } = require('http-status-codes')
const { register, deleteUser, getUsers, updateUser } = require('../Controller/User/User')
const { updateAuth, login, refreshToken, verifyEmail } = require('../Controller/User/Auth')
const { getRoles } = require('../Controller/User/Role')
const { subscribe, unsubscribe } = require('../Controller/User/Hosteller')
const upload = require('../Middleware/storeImage').single('image')

const uploadMiddleware = (req, res, next) => {
    upload(req, res, err => {
        if (err)
            res.status(StatusCodes.BAD_REQUEST).send(`${err.message} ${err.field}. Expected image`)
        else
            next()
    })
}

router
    .route('/')
    .get(getUsers)
    .delete(auth, deleteUser)
    .post(auth, uploadMiddleware, updateUser)
    .patch(auth, uploadMiddleware, updateUser)

router
    .route('/email')
    .post(verifyEmail)

router
    .route('/role')
    .get(auth, getRoles)

router
    .route('/password')
    .patch(auth, updateAuth)

router
    .route('/login')
    .post(login)

router
    .route('/register')
    .post(register)

router
    .route('/subscribe')
    .post(subscribe)

router
    .route('/unsubscribe')
    .post(unsubscribe)

router
    .route('/token')
    .post(refreshToken)


module.exports = router