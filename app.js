const express = require('express')
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const morgan = require('morgan');


connectDB()
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

app.use(morgan('dev'))
// app.use(morgan('tiny'))

app.listen(port,() => console.log(`server is ranning in port ${port}`) );

