const {connectToDatabase} = require('./db_model.js'); 


const userModel = {
    getUsers: async () => {
        const connection = await connectToDatabase();
        const [rows] = await connection.query(`select * from users`);
        return rows;
    },
    getUserById: async (id) => {
        const connection = await connectToDatabase();
        const sql = `select * from users where id = ?`;
        const [rows] = await connection.query(sql,[id]);
        return rows;
    },
    checkUserExist: async (email, password) => {
        const connection = await connectToDatabase();
        const sql = `select * from users where email = ? and password = ?`;
        const [user] = await connection.query(sql, [email, password]);        
        return user.length > 0 ? user : null;
    },
    addUser: async (fullname, email, password) => {
        const connection = await connectToDatabase();
        const sql = `insert into users (full_name,email,password) values (?,?,?)`;
        try{
            const [res] = await connection.query(sql, [fullname,email, password]);
            return res.affectedRows > 0 ;
        }catch(e){
            console.error(e);
            return false;
        }
        
    }
}


module.exports = userModel;