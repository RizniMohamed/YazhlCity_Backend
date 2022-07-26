const router = require('express').Router()
const auth = require('../Middleware/auth')
const { StatusCodes } = require('http-status-codes')
const { register, deleteUser, getUsers, updateUser } = require('../Controller/User/User')
const { updateAuth, login, refreshToken, verifyEmail, getAuths } = require('../Controller/User/Auth')
const { getRoles } = require('../Controller/User/Role')
const { subscribe, unsubscribe } = require('../Controller/User/Hosteller')
const { APIError } = require('../Middleware/errorHandler')
const upload = require('../Middleware/storeImage')


const uploadMiddleware = async (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            const msg = `${err.message} ${err.field}. Expected image`
            console.log(msg);
            return res.status(StatusCodes.OK).json({ status: StatusCodes.BAD_REQUEST, data: msg })
        }
        else { next() }
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
    .route('/auth')
    .get(auth, getAuths)

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