var bcrypt = require('bcryptjs');
var fs = require('fs');
var cryptoRandomString = require('crypto-random-string');
var sendMail = require('./../utils/sendMail')
require('dotenv').config();
var path = require('path')
var jwt = require('jsonwebtoken')


module.exports = {

    //Register Functionality
    register: function(req, res, next){
        let { newUserName, newEmail, newPassword } = req.body;
        //check if user already exists
        let rawdata = fs.readFileSync(path.join(__dirname, '../Users.json'));
        let users = JSON.parse(rawdata);

        for(let i in users){
            if(users[i].email == newEmail)
                return res.status(200).json({
                    message: "User already exists in database",
                    data: ""
                });
        }

        //Password being hashed
        bcrypt.hash(newPassword,process.env.HASHKEY*1)

            .then((hashedPassword)=>{
            
                var verificationCode = cryptoRandomString({length: 10, type: 'url-safe'});
                //Send verification mail
                sendMail({
                    from: process.env.SMTP_FROM_MAIL,
                    to: newEmail,
                    subject: 'Account Verification Mail',
                    text: `Please click below link to verify your email: 
                    http://localhost:${process.env.PORT}/accVerification/${verificationCode}
                    `
                }, function (err, data) {
                    if (err)
                        return res.status(502).json({
                            message: "Verification mail not sent successfully",
                            data: err
                        });
                    //Add user to DB if successfully sent mail
                    let newUser = {
                        userName: newUserName,
                        email: newEmail,
                        password: hashedPassword,
                        verificationCode: verificationCode,
                        isVerified: false
                    };
                    users.push(newUser);

                    fs.writeFileSync(path.join(__dirname,'../Users.json'), 
                                    JSON.stringify(users,null,2));
                    return res.status(200).json({
                        message: "User Successfully registered",
                        data: ''
                    })
                });
        });
    },

    //Account verification via mail functionality
    accVerification: function(req, res, next){
        let verificationCode = req.params.code;
        let rawdata = fs.readFileSync(path.join(__dirname, '../Users.json'));
        let users = JSON.parse(rawdata);
        let notfoundCodeFlag = true;
        for(let i in users){
            if(users[i].verificationCode == verificationCode){
                notfoundCodeFlag = false;
                if(users[i].isVerified == true)
                    return res.status(200).json({
                        message: "User already verified",
                        data: ''
                    })
                users[i].isVerified = true;
                
                fs.writeFileSync(path.join(__dirname,'../Users.json'), 
                        JSON.stringify(users,null,2));
                return res.status(200).json({
                    message: "User email successfully verified",
                    data: ''
                })
            }
        }
        
        if(notfoundCodeFlag)
            return res.status(404).json({
                message: "Invalid code",
                data: ''
            })
    },

    //Login functionality
    login: function(req, res, next){

        //Set/Check JWT for login attempts 

        if (!req.headers || !req.headers.token) {
            login_count = 0;
        }
        else{
        jwt.verify(
            req.headers.token,
            process.env.JWT_SECRET,
            function (err, login_count) {
                //handling error
            });
        }

        //////////////////////////////////////

        let { email, password } = req.body;
        
        let rawdata = fs.readFileSync(path.join(__dirname, '../Users.json'));
        let users = JSON.parse(rawdata);
        let userNotFoundFlag = true;
        for(let i in users){
            if(users[i].email == email){
                userNotFoundFlag = false;

                //Account verified check
                if(!users[i].isVerified)
                    return res.status(200).json({
                        message: "Account not verified",
                        data: {token: jwt.sign(login_count+1)}
                    });

                //Incorrect password
                if(!bcrypt.compareSync(password, users[i].password))
                    return res.status(401).json({
                        message: "Incorrect Password",
                        data: {token: jwt.sign(login_count+1)}
                    });
                
                return res.status(200).json({
                    message: "Successful login",
                    data: {
                        userName: users[i].userName,
                        token: jwt.sign(users[i].email, process.env.JWT_SECRET)
                    }
                });
            }
        }
        
        //User email not in DB
        if(userNotFoundFlag){
            if(login_count >3){
                //Block user IP
            }
            return res.status(401).json({
                message: "Invalid Username",
                data: {token: jwt.sign(login_count+1)}
            });
        }
    },

    //Send mail for forgot password functionality
    forgotPwd: function(req, res, next){
        let { email } = req.body;
        let passwordResetCode = cryptoRandomString({length: 10, type: 'url-safe'});
        
        let rawdata = fs.readFileSync(path.join(__dirname,'../Users.json'));
        let users = JSON.parse(rawdata);

        let userNotFoundFlag = true;
        //Check if user exists in DB
        for(let i in users){
            if(users[i].email == email){
                userNotFoundFlag = false;
                users[i].passwordResetCode = passwordResetCode;
                users[i].passwordExpiryDate = Date.now() + 3*24*60*60*1000;
            }
        }
        
        if(userNotFoundFlag)
            return res.status(401).json({
                message: "Invalid user",
                data: ""
            });
        //Send password reset link
        sendMail({
            from: process.env.SMTP_FROM_MAIL,
            to: email,
            subject: 'Password Reset Link',
            text: `Find the code to reset your password: ${passwordResetCode}`
        },
        function(err,data){
            if (err)
                return res.status(502).json({
                    message: "Reset password mail not sent successfully",
                    data: err
                });

            //Update user database
            fs.writeFileSync(path.join(__dirname,'../Users.json'),
                                JSON.stringify(users,null,2))
            
            return res.status(200).json({
                message: "Reset password mail sent to user",
                data: ""
            });
        })
    },

    //Reset password via reset code functionality
    resetPwd: function(req, res, next){
        let { resetCode } = req.params;
        let { newPassword } = req.body;
        
        newPassword = bcrypt.hashSync(newPassword,process.env.HASHKEY*1, (v)=>v);

        let rawdata = fs.readFileSync(path.join(__dirname,'../Users.json'));
        let users = JSON.parse(rawdata);

        let userNotFoundFlag = true;
        //Check if user exists in DB
        for(let i in users){
            if(users[i].passwordResetCode == resetCode){
                userNotFoundFlag = false;
                if(users[i].passwordExpiryDate < Date.now()){
                    return res.status(200).json({
                        message: "Reset Code Expired",
                        data: ""
                    })
                }
                users[i].password = newPassword;
                users[i].passwordResetCode = null;
                fs.writeFileSync(path.join(__dirname,'../Users.json'),
                JSON.stringify(users,null,2))
                return res.status(200).json({
                    message: "Password reset",
                    data: ''
                })
            }
        }
        
        if(userNotFoundFlag)
            return res.status(401).json({
                message: "Invalid reset code",
                data: ""
            });

    },
    profile: function(req,res,next){
        if (!req.headers || !req.headers.token) {
            return res.status(422).json({
                message: "The token is required.",
                data: ""
            });
        }
        jwt.verify(
            req.headers.token,
            process.env.JWT_SECRET,
            function (err, emailId) {
                if (err) {
                    if(err.name === "JsonWebTokenError") {
                        return res.status(442).json({
                            message: "The user is not authorised or expired token.",
                            data: ""
                        });
                    }
                }
            let rawdata = fs.readFileSync(path.join(__dirname,'../Users.json'));
            let users = JSON.parse(rawdata);

            let userNotFoundFlag = true;
            
            for(let i in users){
                if(users[i].email == emailId){
                    return res.status(200).json({
                        message: "",
                        data: {
                            userName: users[i].userName,
                            userEmail: users[i].email
                        }
                    });
                    userNotFoundFlag = false;
                }
            }
            if(userNotFoundFlag)
                return res.status(442).json({
                    message: "The user is not authorised or expired token.",
                    data: ""
                })
            })              
        }
}
