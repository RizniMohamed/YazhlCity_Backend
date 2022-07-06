const mysql = require("mysql2/promise");

// Open the connection to MySQL server and create database
const createDatabase = async () => {
    const conn = await mysql.createConnection({ // create connection with mysql
        host: process.env.DB_HOSt,
        user: process.env.DB_USERNAME,
        password: process.env.DB_Password
    })
    const status = await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`) // create database in mysql
    const isDatabaseExists = await conn.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`)
    return (isDatabaseExists[0][0]['SCHEMA_NAME'] === process.env.DB_NAME);
}

module.exports = createDatabase