const createDatabase = require("./Config/CreateDB");
const sequelize = require("./Config/Sequelize");
require('./Config/TableAssociations')

//check connection and return the connection status
const start = async () => {
    try {
        const isDatabaseCreated = await createDatabase()
        if (isDatabaseCreated) {
            await sequelize.authenticate()
            await sequelize.sync({alter:true})
            // await sequelize.sync()
            return true // database and sequalize initializtion success
        } else {
            return false // error on database creation
        }
    } catch (error) {
        console.log(error);
        return false // error on sequalize initializtion
    }
}

module.exports = start()

