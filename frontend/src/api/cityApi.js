import axios from "axios";

const apiClient = axios.create({
    timeout: 5000, // 5 seconds
});

const cityApi = {
    getReverseGeocoding: async (lat, lon) => {
        try {
            const apiKey = import.meta.env.VITE_GEOAPIKEY;
            const res = await apiClient.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`
            );
            return res.data;
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            throw new Error('Failed to fetch location data. Please try again.');
        }
    },

    getForwardGeocoding: async (text) => {
        try {
            const apiKey = import.meta.env.VITE_GEOAPIKEY;
            const res = await apiClient.get(
                `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`
            );
            return res.data;
        } catch (error) {
            console.error('Forward geocoding failed:', error);
            throw new Error('Failed to search location. Please try again.');
        }
    }
};

export default cityApi;
