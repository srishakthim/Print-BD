const { isAuthendicate, authorizeRoles } = require('../middlewere/authendicate');
const userRoute = require('express').Router();
const UserFunction = new (require('../module/userModule'));


// api/v1/user/
userRoute.route("/create").post(UserFunction.CreateUser);

userRoute.route("/list").get(isAuthendicate, authorizeRoles("Admin","User"), UserFunction.AllUser);

userRoute.route("/:id")
    .get(UserFunction.GetUserByID)
    .delete(UserFunction.DeleteUser)
    .put(isAuthendicate, authorizeRoles("Admin", "User"), UserFunction.UpdateUser);


module.exports = userRoute;