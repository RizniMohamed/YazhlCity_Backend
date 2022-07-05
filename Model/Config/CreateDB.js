const mysql = require("mysql2/promise");

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

module.exports = createDatabase