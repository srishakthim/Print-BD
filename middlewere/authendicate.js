const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require('../schema/userSchema');



exports.isAuthendicate = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return next(new ErrorHandler("Long in first to handle this resource"))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()

})


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is Not Allowed`, 401))
        }
        next()
    }
}
