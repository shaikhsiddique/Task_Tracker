const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const cors = require('cors');
const cookie_parser = require('cookie-parser');
const morgan = require('morgan');


const userRouter = require('./routes/user.routes');



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());
app.use(cookie_parser());

db();



app.use("/user",userRouter);


module.exports = app;
