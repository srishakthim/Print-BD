const express = require('express');
const AllRouters = require('./router/allRoute');
const dbConnection = require('./config/database')
const app = express();
const cors = require('cors');
// const errorhandlerMiddilewere = require('./middlewere/error');
// const socket = require('socket.io');
// const cookieParser = require('cookie-parser');
// const userModel = require('./schema/userSchema');
// const MessageFunction = new (require('./module/chatModule'));
const server = app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server Listening to the Port ${process.env.PORT} in ${process.env.NODE_ENV}, Host ${process.env.HOST}`)
});

app.use(express.json({ limit: '200mb' }))
require('dotenv').config({ path: './config/.env' });
// app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
dbConnection();

app.use("/api/v1", AllRouters);
// app.use(errorhandlerMiddilewere);