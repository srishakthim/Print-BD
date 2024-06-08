const mongoose = require('mongoose')
const adsSchema = new mongoose.Schema({
    // level: String,
    image: String,
    ads: String,
    created_by: String

});

const adsModel = mongoose.model("Ads", adsSchema);



module.exports = adsModel;