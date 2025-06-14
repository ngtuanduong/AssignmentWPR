const mysql = require("mysql2/promise");
const dbConfig = {
    host: process.env.DB_HOST || "mysql.railway.internal", // Docker gọi tới service "mysql"
    port: 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "NlOSOOivEpBlaylZGLmhQPxYdJBaaAGW",
    database: process.env.DB_NAME || "railway",
};
let connection = null;
async function connectToDatabase() {
    try {
        connection = await mysql.createConnection(dbConfig);
        if (!connection) {
            console.error("Database connection not established");
        }
        console.log("✅ Connected to DB");
        return connection;
    } catch (e) {
        console.error(e);
    }
}

module.exports = { connectToDatabase };
