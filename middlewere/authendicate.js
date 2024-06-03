const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../schema/userSchema");

exports.isAuthendicate = catchAsyncError(async (req, res, next) => {
  console.log("Headers", req.headers);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token error", status: false });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
  console.log("Token: " + token);
  if (!token) {
    return res.status(400).json({ message: "Token error", status: false });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is Not Allowed`, 401)
      );
    }
    next();
  };
};
