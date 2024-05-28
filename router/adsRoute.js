const adsRoute = require('express').Router();
const AdsFunction = new (require('../module/adsModule'))


// api/v1/auth/
adsRoute.route("/create").post(AdsFunction.CreateAds)
adsRoute.route("/delete/:id").delete(AdsFunction.DeleteAds)
adsRoute.route("/list").post(AdsFunction.ListAds)
module.exports = adsRoute;
