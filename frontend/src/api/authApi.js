import axios from "axios";
import { SERVER_URL } from "../App";

const authApi = {
    checkAuth: async () => {
        const res = await axios.get(`${SERVER_URL}/api/user/current`, {
            withCredentials: true,
        });
        return res.data;
    },

    signin: async (email, password) => {
        const res = await axios.post(
            `${SERVER_URL}/api/auth/signin`,
            { email, password },
            { withCredentials: true }
        );
        return res.data;
    },

    googleAuth: async (data) => {
        const res = await axios.post(
            `${SERVER_URL}/api/auth/google-auth`,
            data,
            { withCredentials: true }
        );
        return res.data;
    },

    signup: async (userData) => {
        const res = await axios.post(
            `${SERVER_URL}/api/auth/signup`,
            userData,
            { withCredentials: true }
        );
        return res.data;
    },

    signout: async () => {
        const res = await axios.get(`${SERVER_URL}/api/auth/signout`, {
            withCredentials: true,
        });
        return res.data;
    },

    sendOtp: async (email) => {
        const res = await axios.post(
            `${SERVER_URL}/api/auth/send-otp`,
            { email },
            { withCredentials: true }
        );
        return res.data;
    },

    verifyOtp: async (email, otp) => {
        const res = await axios.post(
            `${SERVER_URL}/api/auth/verify-otp`,
            { email, otp },
            { withCredentials: true }
        );
        return res.data;
    },

    resetPassword: async (email, newPassword) => {
        const res = await axios.post(
            `${SERVER_URL}/api/auth/reset-password`,
            { email, newPassword },
            { withCredentials: true }
        );
        return res.data;
    }
};

export default authApi;
