const multer = require('multer');
const JWT = require('jsonwebtoken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Image')
    },
    filename: (req, file, cb) => {
        cb(null, `${req.JWT_DATA.email}.._${req.JWT_DATA.userID}.png`)
    }
})

module.exports = multer({ storage })