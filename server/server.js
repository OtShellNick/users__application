require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {PORT} = process.env;
const App = express();

App.use(express.json({ limit: '50mb' }));
App.use(cookieParser());
App.use(cors());


App.use('/users', require('./requests/users'));

App.listen(PORT, () => {
    console.log(`Server started at ${PORT} port`);
})