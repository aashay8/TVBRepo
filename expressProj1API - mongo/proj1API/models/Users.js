var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userData = new Schema({
    userName: String,
    email: String,
    password: String,
    verificationCode: String,
    isVerified: {type: Boolean, default: false},
    passwordResetCode: String,
    passwordExpiryDate: Date
});

module.exports = mongoose.model('Users', userData);