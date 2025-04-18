const { MailtrapClient } = require("mailtrap");
const { mailtrapclient, sender }= require ('../mailTrap/mailTrap.config')
require('dotenv').config()
const { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE }= require ('./emailTemplate')

const  send_Auth_Email =  async (email , OTP)=>{
    const recipient = [{ email }];
    try {
		const response = await mailtrapclient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", OTP),
			category: "Email Verification",
            })
            console.log('Email sent successfully:', response);
            return response;
            }catch(error){
                console.error('Error sending verification email:', error);
            }           
}

const send_reset_Email = async (email,reset_Password_OTP , resetLink)=>{

    const recipient = [{ email }];
    try {
		const response = await mailtrapclient.send({
			from: sender,
			to: recipient,
			subject: "Reset password email",
			html: PASSWORD_RESET_REQUEST_TEMPLATE
            .replace("{OTP}", reset_Password_OTP)
            .replace("{resetLink}", resetLink) ,
			category: "Reset password",
            })
            
            console.log('Email sent successfully:', response);
            return response;

            }catch(error){
                console.error('Error sending Reset password email:', error);
            }   

}



module.exports =  {send_Auth_Email , send_reset_Email} 