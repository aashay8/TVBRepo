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

/**
 * @api {post} /register Registration API
 * @apiName Registration Controller
 * @apiGroup Index
 *
 * @apiParam {String} userName Name of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 *  
 * @apiSuccess {String} message User Successfully registered
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "User Successfully registered",
          data: ""
 *     }
 *
 * @apiError MailServerError Code 502 Verification mail not sent successfully
 * @apiError ExistingUser Code 200 User already exists in database
 *           
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 502 Authentication Error
 *     {
 *       "message": "Verification mail not sent successfully"
 *     }
 */
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
 * @apiSuccess {String} message Profile Data
 * @apiSuccess {String} data {userName, userEmail}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Profile Data",
          data: {
            userName: users[i].userName,
            userEmail: users[i].email
          }
 *     }
 *
 * @apiError AuthenticationError Code 442 The user is not authorised or expired token.
 * @apiError TokenNotFoundError Code 422 The token is required.
 *         
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "The user is not authorised or expired token."
 *     }
 */
router.get('/profile',profileController)

module.exports = router;
