// const adsModel = require("../schema/adSchema");

// function AdsFunction() {

// }

// AdsFunction.prototype.ListAds = async (req, res, next) => {
//     const { level, created_by } = req.body
//     try {
//         const message = await adsModel.find({ level, created_by })
//         res.json({ "status": true, message });
//     }
//     catch (error) {
//         res.json({ "status": false, "message": error });
//     }
// };
// AdsFunction.prototype.DeleteAds = async (req, res, next) => {
//     const { id } = req.params
//     try {
//         const message = await adsModel.findByIdAndDelete(id)
//         res.json({ "status": true, message });
//     }
//     catch (error) {
//         res.json({ "status": false, "message": error });
//     }
// };

// AdsFunction.prototype.CreateAds = async (req, res, next) => {
//     try {
//         const { level } = req.body;
//         const existingAds = await adsModel.findOne({ level });

//         if (existingAds) {
//             const updatedAds = await adsModel.findOneAndUpdate({ level }, req.body, { new: true });

//             return res.json({ "status": true, message: updatedAds });
//         } else {
//             const createdAds = await adsModel.create(req.body);

//             return res.json({ "status": true, message: createdAds });
//         }
//     } catch (error) {
//         res.json({ "status": false, "message": error });
//     }
// };

// module.exports = AdsFunction;


const adsModel = require("../schema/adSchema");
const multer = require('multer');
// const path = require('path');

//set storage for multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


function AdsFunction() {

}

AdsFunction.prototype.ListAds = async (req, res, next) => {
    const { created_by } = req.body;
    try {
        const message = await adsModel.find({ created_by });
        res.json({ status: true, message });
    } catch (error) {
        res.json({ status: false, message: error });
    }
};
AdsFunction.prototype.DeleteAds = async (req, res, next) => {
   const { id } = req.params;
    try {
        const message = await adsModel.findByIdAndDelete(id);
        res.json({ status: true, message });
    } catch (error) {
        res.json({ status: false, message: error });
    }
};

AdsFunction.prototype.CreateAds = async (req, res, next) => {
    try {
        const newAd = {
            ...req.body,
            image: req.file ? req.file.path : null
        };
        const createdAds = await adsModel.create(newAd);
        res.json({ status: true, message: createdAds });
    } catch (error) {
        res.json({ status: false, message: error });
    }
};

AdsFunction.prototype.UpdateAds = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.image = req.file.path;
        }
        const updatedAds = await adsModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.json({ status: true, message: updatedAds });
    } catch (error) {
        res.json({ status: false, message: error });
    }
}

module.exports = AdsFunction;