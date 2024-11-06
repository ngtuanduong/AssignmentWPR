const { decryptText } = require('../crypto/crypto');
const userModel = require('../models/user_model.js');


async function loginPage(req, res) {
    if (req.cookies.email && req.cookies.password) {
        let email = decryptText(req.cookies.email);
        let password = decryptText(req.cookies.password);
        let result = await userModel.checkUserExist(email, password);
        if (result) {
            res.redirect('/inbox');
        }
    } else {
        res.render('form-login', {
            title: 'Login',
            cssPath: '/css/form.css',
            jsPath: '/script/login.js'
        });
    }
}
function signupPage(req, res) {
    res.render('form-signup', {
        title: 'Signup',
        cssPath: '/css/form.css',
        jsPath: '/script/signup.js'
    })
}
function inbox(req, res) {
    if (req.cookies.email && req.cookies.password) {
        res.render('home', {
            cssPath: '/css/style.css',
            jsPath: '/script/home.js',
            username: decryptText(req.cookies.full_name),
            email: decryptText(req.cookies.email),
            title: 'Inbox',
            main: 'box',
            inbox: true
        });
    } else {
        res.status(403).send('Access denied')
    }
}
function outbox(req, res) {
    if (req.cookies.email && req.cookies.password) {
        res.render('home', {
            cssPath: '/css/style.css',
            jsPath: '/script/home.js',
            username: decryptText(req.cookies.full_name),
            email: decryptText(req.cookies.email),
            title: 'Outbox',
            main: 'box',
            outbox: true
        });
    } else {
        res.status(403).send('Access denied')
    }
}
function compose(req, res) {
    if (req.cookies.email && req.cookies.password) {
        res.render('home', {
            cssPath: '/css/style.css',
            jsPath: '/script/home.js',
            username: decryptText(req.cookies.full_name),
            email: decryptText(req.cookies.email),
            title: 'Compose',
            main: 'compose',
            compose: true
        });
    } else {
        res.status(403).send('Access denied')
    }
}
function detail(req, res) {
    if (req.cookies.email && req.cookies.password ) {
        res.render('home', {
            cssPath: '/css/style.css',
            jsPath: '/script/home.js',
            username: decryptText(req.cookies.full_name),
            email: decryptText(req.cookies.email),
            title: 'Detail',
            main: 'detail',
            emailId: req.params.id
        });
    }else{
        res.status(403).send('Access denied')
    }
}
module.exports = {
    loginPage,
    signupPage,
    inbox,
    outbox,
    compose,
    detail
}