const router = require('express').Router()
const auth = require('../../Middleware/auth')
const upload = require('../../Middleware/storeImage')
const { deleteUser, getUsers, updateUser } = require('../../Controller/User/User')

router
    .route('/')
    .get(getUsers)
    .delete(deleteUser)
    .patch(auth,upload.single('image'),updateUser)

module.exports = router