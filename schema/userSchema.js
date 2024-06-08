const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: [true, "Please Enter Username"]
    },
    email: {
        type: String,
        // required: [true, "Please Enter Email"]
    },
    phone: {
        type: String,
        // required: [true, "Please Enter Phone"]
    },
    password: {
        type: String,
        // required: [true, "Please Enter Password"]
    },
    whatsapp: {
        type: String,
        // required: [true, "Please Enter Phone"]
    },
    gst:{
        type: String,
        // required:[true,"Please Enter GST"]
    },
    address1:{
        type: String,
        // required:[true,"Please Enter Address 1"]
    },
    address2:{
        type: String,
        // required:[true,"Please Enter Address 2"]
    },
    city:{
        type: String,
        // required:[true,"Please Enter City"]
    },
    pincode:{
        type: String,
        // required:[true,"Please Enter Pincode"]
    },
    state:{
        type: String,
        // required:[true,"Please Enter State"]
    },
    isLogged:{
        type: Boolean,
        // required:[false,"Please Enter State"],
        default:false
    },
    role:{
        type:String
    },
    image:{
        type:String
    } 

})


// Generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Password Validation
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("users", userSchema)
module.exports = userModel;