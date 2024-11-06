const mysql = require('mysql2/promise');
const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'wpr',
    password: 'fit2024',
    database: 'wpr2201040036'
};
let connection = null;
async function connectToDatabase() {
    try {

        connection = await mysql.createConnection(dbConfig);
        if (!connection) {
            console.error('Database connection not established');
        }
        return connection;
    } catch (e) {
        console.error(e);
    }

};

module.exports = {connectToDatabase} ;