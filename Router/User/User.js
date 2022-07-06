const router = require('express').Router()
const auth = require('../../Middleware/auth')
const { deleteUser, getUsers, updateUser } = require('../../Controller/User/User')

router
    .route('/')
    .get(getUsers)
    .delete(deleteUser)
    .patch(updateUser)

module.exports = router