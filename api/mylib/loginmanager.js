var jwt = require('jsonwebtoken');
var crypto = require('crypto');

class LoginManager {
    constructor (secret) {
        this.isAuthenticated = false;
        this.secret = secret;
        this.saltlen = 16;
        this.hashlen = 32;
        this.iter = 1000;
        this.tokenexpr = 300;
    }
    genToken (user){
        var token = jwt.sign({
            authuser: user, expiry: this.tokenexpr
          }, this.secret, { expiresIn: this.tokenexpr });
        return token;
    }
    verifyToken (token){
        var decoded = {success: false, error: ''};
        try {
            var ret = jwt.verify(token, this.secret);
            decoded.authuser = ret.authuser;
            decoded.success = true;
          } catch(err) {
            decoded.error = err;
          }
        return decoded;
    }
    genPasswordHash (password) {
        var salt = crypto.randomBytes(this.saltlen).toString('hex');
        var hash = crypto.pbkdf2Sync(password, salt, this.iter, this.hashlen, `sha512`).toString(`hex`);
        return hash+':'+salt;
    }
    checkPasswordHash (clearpw, hashedpw) {
        var hpw = hashedpw.split(':');
        var hash = crypto.pbkdf2Sync(clearpw, hpw[1], this.iter, this.hashlen, `sha512`).toString(`hex`);
        if (hash === hpw[0]){
            return true;
        } else {
            return false;
        }
    }
}

module.exports = LoginManager;
