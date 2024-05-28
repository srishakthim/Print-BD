const adsModel = require("../schema/adSchema");

function AdsFunction() {

}

AdsFunction.prototype.ListAds = async (req, res, next) => {
    const { level, created_by } = req.body
    try {
        const message = await adsModel.find({ level, created_by })
        res.json({ "status": true, message });
    }
    catch (error) {
        res.json({ "status": false, "message": error });
    }
};
AdsFunction.prototype.DeleteAds = async (req, res, next) => {
    const { id } = req.params
    try {
        const message = await adsModel.findByIdAndDelete(id)
        res.json({ "status": true, message });
    }
    catch (error) {
        res.json({ "status": false, "message": error });
    }
};

AdsFunction.prototype.CreateAds = async (req, res, next) => {
    try {
        const { level } = req.body;
        const existingAds = await adsModel.findOne({ level });

        if (existingAds) {
            const updatedAds = await adsModel.findOneAndUpdate({ level }, req.body, { new: true });

            return res.json({ "status": true, message: updatedAds });
        } else {
            const createdAds = await adsModel.create(req.body);

            return res.json({ "status": true, message: createdAds });
        }
    } catch (error) {
        res.json({ "status": false, "message": error });
    }
};

module.exports = AdsFunction;
