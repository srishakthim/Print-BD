const allRouter = require('express').Router();
// const authRoute = require('../router/authRouter');
// const userRoute = require('../router/userRoute');
const path = require('path');
const fs = require('fs');
const adsRoute = require('./adsRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRouter');

// allRouter.use("/auth", authRoute);
allRouter.use("/auth",authRoute)
allRouter.use("/user",userRoute)
allRouter.use("/ad",adsRoute);


module.exports = allRouter;
