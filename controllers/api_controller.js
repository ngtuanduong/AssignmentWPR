const userModel = require('../models/user_model.js');
const emailModel = require('../models/email_model.js');
const multer = require('multer');


async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    let result = await userModel.checkUserExist(email, password);    
    if (result) {
        res.cookie('full_name', result[0].full_name)
        res.cookie('email', email);
        res.cookie('password', password);
        res.redirect('/inbox');
    } else {
        res.render('form-login', {
            title: 'Login',
            cssPath: '/css/form.css',
            error: "Wrong email or password"
        });
    }
}
async function signup(req, res) {
    const full_name = req.body.full_name;
    const email = req.body.email;    
    const password = req.body.password;    
    let result = await userModel.addUser(full_name, email, password);
    res.json({success:result});
}

async function getInbox(req, res) {
    const email = req.body.email;
    let emails = await emailModel.getUserInbox(email);
    res.json(emails);
}

async function getOutbox(req, res) {
    const email = req.body.email;
    let emails = await emailModel.getUserOutbox(email);
    res.json(emails);
}
async function getOtherUsers(req, res) {
    let users = await userModel.getUsers();
    res.json(users);
}
async function getEmailDetail(req, res) {
    const emailId = req.body.emailId;
    let email = await emailModel.getEmailDetail(emailId);
    res.json(email);
}
async function addEmail(req, res) {
    const upload = multer({ dest: "uploads/" });
    const senderEmail = req.body.senderEmail;
    const receiverEmail = req.body.receiverEmail;
    const subject = req.body.subject;
    const body = req.body.body;
    let rs = await emailModel.addEmail(senderEmail, receiverEmail, subject, body);

    res.json(rs);
}
async function deleteEmail(req, res) {
    const emailId = req.body.emailId;
    const hideFrom = req.body.hideFrom;
    let rs = await emailModel.deleteEmail(hideFrom, emailId);
    res.json({
        success: rs.affectedRows > 0 ? true : false
    });


}
module.exports = {
    login,
    signup,
    getOtherUsers,
    getInbox,
    getOutbox,
    getEmailDetail,
    addEmail,
    deleteEmail
}