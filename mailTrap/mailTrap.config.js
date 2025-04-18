const { MailtrapClient } = require("mailtrap");  
require('dotenv').config()


const mailtrapclient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Noran Hamdy",
}; 

module.exports = 
{
  mailtrapclient , 
  sender
}


