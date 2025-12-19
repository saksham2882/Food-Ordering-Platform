import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";
import crypto from "crypto";
import { signUpSchema, signInSchema, resetPasswordSchema } from "../utils/validators.js";
import logger from "../utils/logger.js";


// -------------- Sign Up --------------
export const signUp = async (req, res) => {
    try {
        const validation = signUpSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues?.[0]?.message || "Invalid Input Data";
            logger.warn(`Sign Up Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

        const { fullName, email, password, mobile, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            logger.warn(`Sign Up Failed: Email ${email} already exists`);
            return res.status(400).json({ message: "User with this email already exists." })
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

        const token = genToken(user._id)
        if (!token) {
            return res.status(500).json({ message: "Token generation failed" })
        }
        res.cookie("token", token, {
            secure: true,              // true in production
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        logger.info(`User Registered Successfully: ${email}`);
        return res.status(201).json({ message: "User Registered Successfully", user });

    } catch (error) {
        logger.error("Sign up error:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// -------------- SignIn --------------
export const signIn = async (req, res) => {
    try {
        const validation = signInSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues[0].message || "Invalid Input Data";
            logger.warn(`Sign In Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            logger.warn(`Sign In Failed: User not found for email ${email}`);
            return res.status(400).json({ message: "User does not exist." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            logger.warn(`Sign In Failed: Incorrect password for email ${email}`);
            return res.status(400).json({ message: "Invalid email or password." })
        }

        const token = genToken(user._id)
        if (!token) {
            return res.status(500).json({ message: "Token generation failed" })
        }
        res.cookie("token", token, {
            secure: true,      // true in production (https)
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        logger.info(`User Logged In Successfully: ${email}`);
        return res.status(200).json({ message: "User Login Successfully", user });

    } catch (error) {
        logger.error(`Sign In Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// -------------- Sign Out --------------
export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        logger.info(`User Logged Out Successfully`);
        return res.status(200).json({ message: "Logout Successfully" })

    } catch (error) {
        logger.error(`Sign Out Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// -------------- Send OTP --------------
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }

        // generate otp and save in DB and send to user
        // Secure OTP generation
        const otp = crypto.randomInt(100000, 999999).toString();

        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000     // expire in 5 minutes
        user.isOtpVerified = false;

        await user.save()
        await sendOtpMail(email, otp, user.fullName);
        logger.info(`OTP Sent Successfully to ${email}`);

        return res.status(200).json({ message: "OTP Send Successfully" })

    } catch (error) {
        logger.error(`Send OTP Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// -------------- Verify OTP --------------
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const user = await User.findOne({ email })

        // check otp valid or not
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            logger.warn(`Verify OTP Failed: Invalid or Expired OTP for ${email}`);
            return res.status(400).json({ message: "Invalid or Expired OTP" })
        }

        // if otp is valid
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined

        await user.save()
        logger.info(`OTP Verified Successfully for ${email}`);
        return res.status(200).json({ message: "OTP Verified Successfully" })

    } catch (error) {
        logger.error(`Verify OTP Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// -------------- Reset Password --------------
export const resetPassword = async (req, res) => {
    try {
        const validation = resetPasswordSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues[0].message || "Invalid Input Data";
            logger.warn(`Reset Password Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

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

        logger.info(`Password Reset Successfully for ${email}`);
        return res.status(200).json({ message: "Password Reset Successfully" })

    } catch (error) {
        logger.error(`Reset Password Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// -------------- Google Authentication --------------
export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required for Google Auth" });
        }

        let user = await User.findOne({ email })

        // if user not in DB then create 
        if (!user) {
            // Default password for Google Auth users (random secure string)
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                fullName: fullName || "User",
                email,
                mobile: mobile || "", 
                role: role || "user",
                password: hashedPassword
            })
            
            logger.info(`Google Auth: New User Created - ${email}`);
        } else {
             logger.info(`Google Auth: Existing User Logged In - ${email}`);
        }

        // generate token
        const token = genToken(user._id)
        if (!token) {
            return res.status(500).json({ message: "Token generation failed" })
        }
        res.cookie("token", token, {
            secure: true,      // true in production (https)
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user)

    } catch (error) {
        logger.error(`Google Auth Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}