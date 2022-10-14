const knex = require('knex')
require('dotenv').config();
const db= knex({
    client: 'pg',
    connection: {
        host :  process.env.HOST, //localhost
        user : process.env.DB_USER, //add your user name for the database here
        port: process.env.PORT, // add your port number here
        password : process.env.PASSWORD, //add your correct password in here
        database : process.env.DATABASE //add your database name you created here
    }
});

module.exports = db;
