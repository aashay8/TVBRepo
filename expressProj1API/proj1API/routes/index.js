var express = require('express');
var router = express.Router();
var {validate,
      rules: {
            register,
            login,
            forgotPassword,
            resetPassword
          }
  } = require('../utils/validateFields');
var {
  register: registerController,
  login: loginController,
  accVerification: accVerificationController,
  forgotPwd: forgotPwdController,
  resetPwd: resetPwdController,
  profile: profileController
} = require('./../controllers/index')


router.post('/register', validate(register),registerController);
router.post('/login', validate(login),loginController);
router.get('/accVerification/:code', accVerificationController);
router.post('/forgotPassword', validate(forgotPassword), forgotPwdController);
router.all('/resetPwd/:resetCode', validate(resetPassword), resetPwdController);


/**
 * @api {get} /profile Request Profile View
 * @apiName Profile View
 * @apiGroup Index
 *
 * @apiSuccess {String} message Activity Successfull
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Activity Successfull",
 *       "data": userData
 *     }
 *
 * @apiError AuthenticationError The user is not authorised or expired token.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "The user is not authorised or expired token."
 *     }
 */
router.get('/profile',profileController)

module.exports = router;
