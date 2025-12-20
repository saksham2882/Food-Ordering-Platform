import axios from "axios";

const cityApi = {
    getReverseGeocoding: async (lat, lon) => {
        const apiKey = import.meta.env.VITE_GEOAPIKEY;
        const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`
        );
        return res.data;
    },

    getForwardGeocoding: async (text) => {
        const apiKey = import.meta.env.VITE_GEOAPIKEY;
        const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`
        );
        return res.data;
    }
};

export default cityApi;
