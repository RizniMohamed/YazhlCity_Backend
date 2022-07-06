const { Sequelize } = require('sequelize')
const createDatabase = require('./CreateDB')

// connect database with sequlize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
).beforeConnect(async () => {
    const status = await createDatabase()
    if (!status) {
        console.log("Database not created")
        process.exit(1)
    }
})
module.exports = sequelize