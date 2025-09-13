import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { getResetPasswordTemplate } from "./emailTemplate.js"
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
        throw new Error(`Failed to send email: ${err.message || 'Unknown error'}`);
    }
}