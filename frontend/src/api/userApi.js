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
};

export default userApi;
