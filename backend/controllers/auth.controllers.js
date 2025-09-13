import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

// Sign Up:
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist." })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "Mobile no. must be 10 digits." })
        }

        // Hashing Password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new User
        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,              // true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(201).json({ message: "User Registered Successfully", user });

    } catch (error) {
        return res.status(500).json(`Sign up error: ${error}`)
    }
}

// SignIn:
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,      // true in production (https)
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json({ message: "User Login Successfully", user });

    } catch (error) {
        return res.status(500).json(`Sign In error: ${error}`)
    }
}


// Sign Out
export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout Successfully" })
    } catch (error) {
        return res.status(500).json(`Sign out error: ${error}`)
    }
}


// Send OTP
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }

        // generate otp and save in DB and send to user
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000     // expire in 5 minutes
        user.isOtpVerified = false;

        await user.save()
        await sendOtpMail(email, otp, user.fullName);

        return res.status(200).json({ message: "OTP Send Successfully" })
    } catch (error) {
        return res.status(500).json(`Send OTP error: ${error}`)
    }
}


// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email })

        // check otp valid or not
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" })
        }

        // if otp is valid
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined

        await user.save()
        return res.status(200).json({ message: "OTP Verify Successfully" })
    } catch (error) {
        return res.status(500).json(`Verify OTP error: ${error}`)
    }
}


// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email })

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP Verification Required" })
        }

        // hash new password and save in DB
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()

        return res.status(200).json({ message: "Password Reset Successfully" })
    } catch (error) {
        return res.status(500).json(`Reset password error: ${error}`)
    }
}