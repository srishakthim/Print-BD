const { isAuthendicate, authorizeRoles,authenticateAndAuthorize } = require('../middlewere/authendicate');
const userRoute = require('express').Router();
const UserFunction = new (require('../module/userModule'));


// api/v1/user/
userRoute.route("/usersignin").post(UserFunction.UserSignIn);

userRoute.route("/usercreate").post(UserFunction.UserCreate);

userRoute.route("/create").post(UserFunction.CreateUser);

userRoute.route('/list')
    .get(authenticateAndAuthorize('Admin', 'User'), (req, res, next) => UserFunction.AllUser(req, res, next));

userRoute.route("/:id")
    .get(UserFunction.GetUserByID)
    .delete(UserFunction.DeleteUser)
    .put(isAuthendicate, authorizeRoles("Admin", "User"), UserFunction.UpdateUser);


module.exports = userRoute;