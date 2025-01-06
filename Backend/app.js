const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

db();


module.exports = app;
