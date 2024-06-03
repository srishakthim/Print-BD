const authRoute = require('express').Router();
const AuthFunction = new (require('../module/authModule'));


// api/v1/auth/

authRoute.route("/signup").post(AuthFunction.SignUp);
authRoute.route("/signin").post(AuthFunction.SignIn);
authRoute.route("/forgotpassword").post(AuthFunction.ForgetPassword);
authRoute.route("/logout").post(AuthFunction.Logout);
// authRouth.route("/adminsignin").post(AuthFunction.AdminSignin);
authRoute.route("/add-festival").post(AuthFunction.AddFestival);
authRoute.route("/get-festival-list").post(AuthFunction.FetchFestivalList);
authRoute.route("/edit-festival/:id").post(AuthFunction.EditFestival);
authRoute.route("/delete-festival/:id").get(AuthFunction.DeleteFestival);


module.exports = authRoute;
