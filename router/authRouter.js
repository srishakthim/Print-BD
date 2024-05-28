const authRoute = require('express').Router();
const AuthFunction = new (require('../module/authModule'));


// api/v1/auth/

authRoute.route("/signup").post(AuthFunction.SignUp);
authRoute.route("/signin").post(AuthFunction.SignIn);
authRoute.route("/forgotpassword").post(AuthFunction.ForgetPassword);
authRoute.route("/logout").post(AuthFunction.Logout);


module.exports = authRoute;
