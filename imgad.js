const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String] 
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Advertisement = require('../models/Advertisement');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const { title, description } = req.body;
        const images = req.files.map(file => file.filename);
        const ad = new Advertisement({ title, description, images });
        await ad.save();
        res.status(201).send(ad);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const ad = await Advertisement.findByIdAndDelete(req.params.id);
        if (!ad) return res.status(404).send('Advertisement not found');
        res.status(200).send(ad);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('/:id', upload.array('images', 10), async (req, res) => {
    try {
        const { title, description } = req.body;
        const images = req.files.map(file => file.filename);
        const ad = await Advertisement.findByIdAndUpdate(
            req.params.id,
            { title, description, images },
            { new: true }
        );
        if (!ad) return res.status(404).send('Advertisement not found');
        res.status(200).send(ad);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) return res.status(404).send('Advertisement not found');
        res.status(200).send(ad);
    } catch (error) {
        res.status(500).send(error);
    }
});

s
router.get('/', async (req, res) => {
    try {
        const ads = await Advertisement.find();
        res.status(200).send(ads);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const advertisementsRouter = require('./routes/advertisements');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/advertisement-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/advertisements', advertisementsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
