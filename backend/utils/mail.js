import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { getDeliveryConfirmationOTP, getResetPasswordTemplate } from "./emailTemplate.js"
import logger from "./logger.js";
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 456,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
})

export const sendOtpMail = async (to, otp, name) => {
    try {
        const mail = {
            from: process.env.EMAIL,
            to,
            subject: "Password Reset Request",
            html: getResetPasswordTemplate(name, otp)
        }
        const res = await transporter.sendMail(mail);
        return res;
    } catch (error) {
        logger.error("Email send error:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

export const sendDeliveryOTPMail = async (user, otp) => {
    try {
        const mail = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Delivery Confirmation OTP",
            html: getDeliveryConfirmationOTP(user.fullName, otp)
        }
        const res = await transporter.sendMail(mail);
        return res;
    } catch (error) {
        logger.error("Email send error:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}