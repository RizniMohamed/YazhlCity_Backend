const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

// Open the connection to MySQL server and create database
const createDatabase = () => {
    return mysql
        .createConnection({ // create connection with mysql
            host: process.env.DB_HOSt,
            user: process.env.DB_USERNAME,
            password: process.env.DB_Password
        }).then(conn => {
            return conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`) // create database in mysql
                .then(res => true)
                .catch(err => {
                    console.log(err.message);
                    return false
                })
        }).catch(err => {
            console.log(err.message)
            return false
        })
}

// connect database to sequlize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

//check connection and return the connection status
const start = async () => {
    try {
        const isDatabaseCreated = await createDatabase()
        if (isDatabaseCreated) {
            await sequelize.authenticate()
            await sequelize.sync({ alter: true })
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
