require('express-async-errors')
require('dotenv').config()

const express = require('express')
const app = express()

const notfound = require('./middleware/notfound')
const { errorHandler } = require('./middleware/errorHandler')
const { StatusCodes } = require('http-status-codes');
const isDatabaseInitiated = require('./Model/index');

//import routes
const user = require('./Router/User')
const boarding = require('./Router/Boading')
const room = require('./Router/Room')

//middlewares
app.use(express.json()) //parse reqest body to JSON
app.use(express.static('./Storage')) //make image file is accessiblie to frontend

//routes
app.use("/API/V1/User", user)
app.use("/API/V1/Boarding", boarding)
app.use("/API/V1/Room", room)

app.get("/", (req, res) => {
    res.status(StatusCodes.OK).send("<H1>YAZHL CITY APIs</H1>")
})

app.use(notfound) //invalid routes


app.use(errorHandler) // handle errors


const port = process.env.PORT || 5000

isDatabaseInitiated
    .then(res => {
        if (res)
            app.listen(port, () => console.log(`Server is listening on port ${port}...`))
        else
            console.log("Database Error");
    })