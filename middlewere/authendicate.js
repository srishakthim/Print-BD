const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../schema/userSchema");

exports.isAuthendicate = catchAsyncError(async (req, res, next) => {
  console.log("Headers", req.body);

  const { token } = req.body;

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
exports.authenticateAndAuthorize = (...allowedRoles) => {
  return catchAsyncError(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("authHeader",authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token is missing or invalid', status: false });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found', status: false });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: `Role ${user.role} is not allowed`, status: false });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', status: false });
    }
  });
};
