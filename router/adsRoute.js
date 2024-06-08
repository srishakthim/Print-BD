const adsRoute = require('express').Router();
const AdsFunction = new (require('../module/adsModule'))
const multer = require('multer');

const upload = multer({ storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})});

// api/v1/auth/
adsRoute.route("/create").post(AdsFunction.CreateAds)
adsRoute.route("/delete/:id").delete(AdsFunction.DeleteAds)
adsRoute.route("/list").post(AdsFunction.ListAds)
adsRoute.route("/update/:id").put(upload.single('image'), AdsFunction.UpdateAds);

module.exports = adsRoute;
