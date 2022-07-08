const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { StatusCodes } = require('http-status-codes')
const upload = require('../../Middleware/storeImage').single('image')
const { deleteUser, getUsers, updateUser } = require('../../Controller/User/User')

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
    .delete(deleteUser)
    .patch(auth, uploadMiddleware,updateUser)

module.exports = router