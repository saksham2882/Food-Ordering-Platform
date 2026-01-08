import axios from "axios";
import { SERVER_URL } from "../App";

const userApi = {
    updateLocation: async (lat, lon) => {
        const res = await axios.post(
            `${SERVER_URL}/api/user/update-location`,
            { lat, lon },
            { withCredentials: true }
        );
        return res.data;
    },

    updateProfile: async (data) => {
        const res = await axios.put(
            `${SERVER_URL}/api/user/update-profile`,
            data,
            { withCredentials: true }
        );
        return res.data;
    },

    changePassword: async (data) => {
        const res = await axios.put(
            `${SERVER_URL}/api/user/change-password`,
            data,
            { withCredentials: true }
        );
        return res.data;
    },
};

export default userApi;
