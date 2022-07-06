
//check connection and return the connection status
const start = async () => {
    try {
        const sequelize = await require("./Config/Sequelize");
        await sequelize.authenticate()
        await require('./Config/TableAssociations')
        // await sequelize.sync({force:true})
        await sequelize.sync({ alter: true })
        return true // database and sequalize initializtion success
    } catch (error) {
        console.log(error);
        return false // error on sequalize initializtion
    }
}

module.exports = start()

