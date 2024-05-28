const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL)
        .then(con => console.log(`MongoDb is Successfully Connected`))

}



module.exports = connectDatabase;