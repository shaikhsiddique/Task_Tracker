const mongoose = require("mongoose");
require("dotenv").config();

const connect = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to db")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connect