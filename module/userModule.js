const bcrypt = require('bcrypt');
const userModel = require('../schema/userSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const { default: mongoose } = require('mongoose');
const festivalModel = require('../schema/festivalSchema');


function UserFunction() {

}





// api/v1/user/list
UserFunction.prototype.AllUser = async function (req, res, next) {
    console.log("Request", req);
    const { role } = req.query;

    try {
        let commonMatchConditions = {
            _id: { $ne: new mongoose.Types.ObjectId(req.user["_id"]) },
            status: "Active",
        };

        let pipeline = [
            {
                $match: commonMatchConditions,
            },
            {
                $addFields: {
                    days_left: {
                        $round: {
                            $divide: [
                                {
                                    $subtract: ["$expire_date", new Date()],
                                },
                                1000 * 60 * 60 * 24,
                            ],
                        },
                    },
                },
            },
        ];

        if (role == "Employee") {
            pipeline[0].$match = { ...pipeline[0].$match, ref_id: req.user["ref_id"] };
        }

        const users = await userModel.aggregate(pipeline);
        res.json({ status: true, message: users });
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
        return res.status(200).json({ status: true, data:festivalList })


    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
}



module.exports = UserFunction;