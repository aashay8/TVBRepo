var Validate = require('validatorjs');

module.exports = {
    rules: {
        register:{
            userName: "required",
            email: "required|email",
            password: "required|min:8"
        },
        login: {
            email: "required|email",
            password: "required"
        },
        forgotPassword: {
            email: "required|email"
        },
        resetPassword: {
            newPassword: "required|min:8",
            confirmNewPassword: "same:newPassword"
        }
    },

    validate: function(rulesToApply){
        return function(req,res,next){
            var validateFlag = new Validate(req.body, rulesToApply);
            
            if(validateFlag.fails()){
                var error = validateFlag.errors.all();
                return res.status(422).json({
                    data: {},
                    message: error[Object.keys(error)[0]][0]
                });
            }
            return next();
        }
    }
}