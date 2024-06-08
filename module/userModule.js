const bcrypt = require('bcrypt');
const userModel = require('../schema/userSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const { default: mongoose } = require('mongoose');
const festivalModel = require('../schema/festivalSchema');
const sendToken = require('../utils/JWT');
const createToken = require('../utils/JWT');

// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });

function UserFunction() {

}

UserFunction.prototype.UserCreate = async function (req, res, next) {
    console.log("Request one", req.body);
    try {
        const { email, username, password, phone, whatsapp, gst, address1, address2, city, pincode, state } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            const user = await userModel.create({ email, username, password: hash, phone, whatsapp, gst, address1, address2, city, pincode, state, isLogged: false, role: "user" });
            // sendToken(user, 201, res);
            return res.status(201).json({ success: false, message: "User created successfully",user:{
                email:user?.email,
                username:user?.username
            } });

        }
        else {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// UserFunction.prototype.UserCreate = async function (req, res, next) {
//     console.log("Request", req.body);
//     try {
//         const { email, username, password, phone, whatsapp, gst, address1, address2, city, pincode, state } = req.body;
//         const hash = await bcrypt.hash(password, 10);
//         const userExists = await userModel.findOne({ email });
//         if (!userExists) {
//             const userImage = req.file ? req.file.path : null;
//             const user = await userModel.create({ email, username, password: hash, phone, whatsapp, gst, address1, address2, city, pincode, state, isLogged: false, role: "user", image: userImage });
//             // const user = await userModel.create({ ...req.body, password: hash });

//             sendToken(user, 201, res);
//         } else {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }

UserFunction.prototype.UserSignIn = async function (req, res, next) {
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



// api/v1/user/list
UserFunction.prototype.AllUser = async function (req, res, next) {
    console.log("Request", req.body);

    try {
        const { skip = 0, take = 10 } = req.body;
        const userList = await userModel.find().skip(skip).limit(take);
        if (!userList) {
            return res.status(400).json({ status: false, message: "User list is empty" })
        }
        return res.status(200).json({
            status: true, data: userList.map((user) => {
                return {
                    "isLogged": user?.isLogged,
                    "_id": user?._id,
                    "username": user?.username,
                    "email": user?.email,
                    "phone": user?.phone,
                    "whatsapp": user?.whatsapp,
                    "gst": user?.gst,
                    "address1": user?.address1,
                    "address2": user?.address2,
                    "city": user?.city,
                    "pincode": user?.pincode,
                    "state": user?.state,
                    "role": user?.role
                }
            })
        })


    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//Get User by ID
UserFunction.prototype.GetUserByID = async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await userModel.findOne({ "_id": id });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        res.json({ status: true, message: user });
    }
    catch (error) {
        next(new ErrorHandler(error.message, 404));
    }
};


//api/v1/user/create
UserFunction.prototype.CreateUser = async function (req, res, next) {
    try {
        const { email, username, password } = req.body;
        let isUserExists = await userModel.findOne({ email })
        if (isUserExists) {
            res.status(400).json({ "status": false, message: "User already exists" });
        };
        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ ...req.body, password: hash, role: "User" });

        res.json({ status: true, message: user });
    }
    catch (error) {
        res.status(500).json({ "status": false, message: error.message });
    }
};

//api/v1/user/:id   DELETE
UserFunction.prototype.DeleteUser = async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }

        res.json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        next(new ErrorHandler(error.message, 404));
    }
};


//Update User
UserFunction.prototype.UpdateUser = async function (req, res, next) {
    try {
        const { id } = req.params;
        const { body } = req;
        const updatedUser = await userModel.findByIdAndUpdate(id, body, { new: true });
        return res.json({ status: true, message: updatedUser });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }

};
UserFunction.prototype.FetchFestivalList = async function (req, res, next) {
    try {
        const { skip = 0, take = 10 } = req.body;
        const festivalList = await festivalModel.find().skip(skip).limit(take);
        if (!festivalList) {
            return res.status(400).json({ status: false, message: "Festival list is empty" })
        }
        return res.status(200).json({ status: true, data: festivalList })


    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
}



module.exports = UserFunction;