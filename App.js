require('express-async-errors')
require('dotenv').config()

//securities
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const express = require('express')

const app = express()
const notfound = require('./Middleware/notfound')
const { errorHandler, APIError } = require('./Middleware/errorHandler')
const { StatusCodes } = require('http-status-codes');
const isDatabaseInitiated = require('./Model/index');

//import routes
const user = require('./Router/User')
const boarding = require('./Router/Boading')
const room = require('./Router/Room')
const payment = require('./Router/Payment')
const notification = require('./Router/Notifcation')

//middlewares
// app.use(rateLimit({
//     windowMS: 15 * 60 * 1000, // 15 minutes,
//     max: 100,
//     message : "Maximum requests count reached, try on 15 minutes",
//     handler : function (req,res){
//         throw new APIError("Maximum requests count reached, try on 15 minutes", StatusCodes.TOO_MANY_REQUESTS)
//     }
// }))
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
}))
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}))
app.use(xss())
app.use(express.static('./Storage')) //make image file is accessiblie to frontend
app.use(express.json()) //parse reqest body to JSON
//routes
app.use("/API/V1/User", user)
app.use("/API/V1/Boarding", boarding)
app.use("/API/V1/Room", room)
app.use("/API/V1/Payment", payment)
app.use("/API/V1/Notification", notification)

app.get("/", (req, res) => {
    res.status(StatusCodes.OK).send("<H1>YAZHL CITY APIs</H1>")
})

app.use(notfound) //invalid routes
app.use(errorHandler) // handle errors


const port = process.env.PORT || 5000

isDatabaseInitiated.then(res => {
    if (res)
        app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    else
        console.log("Database not initialized");
})