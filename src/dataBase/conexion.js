require('dotenv').config()
const { Pool } = require('pg')

const credentials = {
    host: 'localhost', //process.env.HOST,
    user: 'postgres', //process.env.USER,
    password: 'root', // process.env.PASSWORD,
    database:'freecoders', // process.env.DATABASE,
    port: 5432, //process.env.DATABASEPORT,
    allowExitOnIdle: true
}

const pool = new Pool(credentials)

module.exports = pool