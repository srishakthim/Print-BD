const bcrypt = require('bcrypt');
const userModel = require('../schema/userSchema');
const sendToken = require('../utils/JWT');
const ErrorHandler = require('../utils/ErrorHandler');


function AuthFunction() {

}


AuthFunction.prototype.SignUp = async function (req, res, next) {
    try {
        const { email, username, password, phone ,whatsapp ,gst ,address1 ,address2 ,city ,pincode ,state } = req.body;
        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({ email, username, password: hash, phone, whatsapp ,gst ,address1 ,address2 ,city ,pincode ,state });

        sendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

AuthFunction.prototype.SignIn = async function (req, res, next) {
try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user || !(await user.isValidPassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }

    if (user.loggedIn) {
        return res.status(401).json({ success: false, message: "User Already Logged in another device" });
    }

    user.loggedIn = true;
    await user.save();

    return res.status(200).json({ success: true, message: "Logged in successfully" });

} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
}


AuthFunction.prototype.ForgetPassword = async function (req, res, next) {
try {
    const { email, phone, newPassword } = req.body;

    const user = await userModel.findOne({ email, phone });

    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid user or phone number" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
}

// // Create user
// UserFunction.prototype.CreateUser = async function (req, res, next) {
//     try {
//         const { password } = req.body;
//         const hash = await bcrypt.hash(password, 10);
//         const user = await userModel.create({ ...req.body, password: hash });

//         res.json({ status: true, message: user });
//     }
//     catch (error) {
//         res.status(500).json({ "status": false, message: error.message });
//     }
// };

//Update User
AuthFunction.prototype.Logout = async function (req, res, next) {
    try {
        const { id } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(id, { loggedIn: "False" }, { new: true });
        return res.json({ status: true, message: updatedUser });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }

};

module.exports = AuthFunction;