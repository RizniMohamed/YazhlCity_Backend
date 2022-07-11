
//check connection and return the connection status
const start = async () => {
    try {
        const sequelize = await require("./Config/Sequelize");
        await sequelize.authenticate()
        await require('./Config/TableAssociations')
        await require('./Config/InitialData')
        // await require('./Config/EventShedules')
        // await sequelize.sync({ alter: true })
        await sequelize.sync()
        return true // database and sequalize initializtion success
    } catch (error) {
        console.log(error);
        return false // error on sequalize initializtion
    }
}

module.exports = start()

