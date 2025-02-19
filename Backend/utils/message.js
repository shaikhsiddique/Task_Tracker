const twilio = require('twilio');
require("dotenv").config();

const sendMessage = async (message,phoneNO)=>{
    console.log(phoneNO);
    
    const client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH);
    return client.messages
    .create({body:message,from:process.env.TWILIO_PHONE_NO,to:phoneNO}).then((message)=>console.log(message,"Message send")).catch((err)=>{console.log(err)})
}

module.exports = sendMessage;