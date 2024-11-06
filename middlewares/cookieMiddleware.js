const { encryptText, decryptText } = require('../crypto/crypto');


function cookieCrypto(req, res, next) {
    if (req.cookies.username) {
        req.cookies.email = decryptText(req.cookies.email);
        req.cookies.password = decryptText(req.cookies.password);
    }
    let cookieOld = res.cookie;
    res.cookie = function (name, value, opt) {
        let encrypted = encryptText(value);
        cookieOld.call(this, name, encrypted, opt);
    };
    next();
};
function sendCookie(res, username, password, age) {
    res.cookie('email', username, {
        maxAge: age
    });
    res.cookie('password', password, {
        maxAge: age
    });
}
// function removeCookie(res){
//     res.cookie = 
// }
module.exports = {
    cookieCrypto: cookieCrypto,
    sendCookie: sendCookie
}
