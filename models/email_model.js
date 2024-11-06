const {connectToDatabase} = require('./db_model.js'); 


const emailModel = {
    getUserInbox: async (email) => {
        const connection = await connectToDatabase();
        let sql = `
        select 
            emails.id,
            emails.subject,
            emails.sent_at,
            sender.full_name
        from emails  
        JOIN users AS sender 
        ON emails.sender_id = sender.id 
        WHERE emails.receiver_id = (select id from users where email = ?) AND emails.receiver_visible = TRUE
        ORDER BY emails.sent_at DESC
        `;
        const [rows] = await connection.query(sql,[email]);        
        return rows;
    },
    getUserOutbox: async (email) => {
        const connection = await connectToDatabase();
        let sql = `
        select 
            emails.id,
            emails.subject,
            emails.sent_at,
            receiver.full_name
        from emails  
        JOIN users AS receiver 
        ON emails.receiver_id = receiver.id 
        WHERE emails.sender_id = (select id from users where email = ?) AND emails.sender_visible = TRUE
        ORDER BY emails.sent_at DESC
        `;
        const [rows] = await connection.query(sql,[email]);       
        return rows;
    },
    getEmailDetail: async (email_id) =>{        
        const connection = await connectToDatabase();
        let sql = `
        select 
            subject, 
            emails.body,
            sender.full_name AS sender_full_name,
            receiver.full_name AS receiver_full_name,
            sender.email AS sender_email,
            receiver.email AS receiver_email
        from emails 
        JOIN users AS sender
        ON emails.sender_id = sender.id
        JOIN users AS receiver
        ON emails.receiver_id = receiver.id
        WHERE emails.id = ?
        `;
        const [rows] = await connection.query(sql,[email_id]);       
        return rows;
    },
    addEmail : async (sender_email,receiver_email,subject,body)=>{
        if(!subject) subject = 'no subject';
        const connection = await connectToDatabase();
        let sql = `
        INSERT INTO emails (
            sender_id,
            receiver_id,
            subject,
            body
        )VALUES (
            (SELECT id FROM users WHERE email = ?),
            (SELECT id FROM users WHERE email = ?),
            ?,
            ?
        )
        
        `;
        const [res] = await connection.query(sql,[sender_email,receiver_email,subject,body]);       
        return res;
    },
    deleteEmail :  async (hideFrom,email_id)=>{
        const connection = await connectToDatabase();
        let sql = `
        UPDATE emails
        SET ?? = false
        WHERE id = ?
        `;
        const [res] = await connection.query(sql,[hideFrom,email_id]);       
        return res;
    }
}


module.exports = emailModel;