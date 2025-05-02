
const genrate_OTP = ()=> {

 const OTP = Math.floor(100000 + Math.random() * 900000).toString();
 return OTP;
 
}
module.exports = genrate_OTP ;