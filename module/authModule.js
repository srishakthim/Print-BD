const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const userModel = require('../schema/userSchema');
const festivalModel = require('../schema/festivalSchema');
const sendToken = require('../utils/JWT');
const createToken = require('../utils/JWT');
const ErrorHandler = require('../utils/ErrorHandler');


function AuthFunction() {

}


AuthFunction.prototype.SignUp = async function (req, res, next) {
    console.log("Request", req.body);
    try {
        const { email, username, password, phone, whatsapp, gst, address1, address2, city, pincode, state } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const userExists = await userModel.findOne({ email });
        // if(userExists)
        if (!userExists) {
            const user = await userModel.create({ email, username, password: hash, phone, whatsapp, gst, address1, address2, city, pincode, state, isLogged: false, role: "Admin" });
            sendToken(user, 201, res);
        }
        else {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
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
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Email" });
        }
        if (!(await user.isValidPassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        if (user.isLogged) {
            return res.status(401).json({ success: false, message: "User Already Logged in another device" });
        }

        user.isLogged = true;
        await user.save();
        let token = user.getJwtToken();
        return res.status(200).json({ success: true, message: "Logged in successfully", token: token, user: { email: user.email, username: user.username } });

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
    console.log("Request", req.body)
    try {
        const { id } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(id);
        updatedUser.isLogged = false;
        updatedUser.save();
        return res.json({ status: true, message: "Logged out successfully" });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }

};


// add Festival
AuthFunction.prototype.AddFestival = async function (req, res, next) {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ status: false, message: "Festival name required." });
        }

        const festival = await festivalModel.create({ ...req.body,createdDate:new Date() });
        console.log(festival);
        return res.status(200).json({ status: true, message: "Festival added successfully" });

    } catch (error) {

        next(new ErrorHandler(error.message, 500));
    }
}
// get Festival
AuthFunction.prototype.FetchFestivalList = async function (req, res, next) {
    try {
        const { skip = 0, take = 10 } = req.body;
        const festivalList = await festivalModel.find().skip(skip).limit(take);
        if (!festivalList) {
            return res.status(400).json({ status: false, message: "Festival list is empty" })
        }
        return res.status(200).json({ status: false, data: festivalList })


    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
}
// get Festival
AuthFunction.prototype.EditFestival = async function (req, res, next) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id) {
            return res.status(400).json({ status: false, message: "Festival Id is required" });
        }
        if (!name) {
            return res.status(400).json({ status: false, message: "Festival name is required" });
        }
        console.log(id,name);
        const festival = await festivalModel.findOne({ _id: new ObjectId(id) });
        if (!festival) {
            return res.status(400).json({ status: false, message: "Festival doesn't exists" })
        }
        festival.name = name;
        festival.modifiedDate=new Date();
        await festival.save()
        return res.status(200).json({ status: false, data: festival })


    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
}
AuthFunction.prototype.DeleteFestival = async function (req, res, next) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ status: false, message: "Festival Id is required" });
        }

        // Convert id to ObjectId and delete the festival
        const result = await festivalModel.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(400).json({ status: false, message: "Festival doesn't exist" });
        }

        return res.status(200).json({ status: true, message: "Festival deleted successfully" });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
}



module.exports = AuthFunction;