const mongoose = require('mongoose')

const festivalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    createdDate:{
        type:Date,
        required: [false, "Please Enter Name"]
        
    },
    modifiedDate:{
        type:Date,
        required: [false, "Please Enter Name"]
        
    }
})





const festivalModel = mongoose.model("festivals", festivalSchema)
module.exports = festivalModel;