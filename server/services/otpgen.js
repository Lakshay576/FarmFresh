const nodemailer = require('nodemailer');
require('dotenv').config();

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random()* 900000);
    return otp.toString();
}

const sendotp = async (email, otp) =>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    const mailoptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
    }
    try {
        await transporter.sendMail(mailoptions);
        console.log("OTP sent to email");
    } catch (error) {
        console.error("Error sending OTP email", error);
        throw new Error("Error sending OTP email");
    }
}

let OtpStorage = {};

const storeOtp = (email, otp) => {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    OtpStorage[email] = {otp, expiresAt};
}

const validateOtp = (email, otp) => {
    const record = OtpStorage[email];
    if(!record){
        return false;
    }

    const {otp: storeOtp, expiresAt} = record;
    const isValid = storeOtp === otp && Date.now() < expiresAt;
    
    if(isValid){
        delete OtpStorage[email];
        console.log("OTP validated successfully");
        return true;
    }
    return false;
}

module.exports = {generateOTP, sendotp, storeOtp, validateOtp};