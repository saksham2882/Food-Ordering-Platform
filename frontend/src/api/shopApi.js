import axios from "axios";
import { SERVER_URL } from "../App";

const shopApi = {
    getShopsByCity: async (city) => {
        const res = await axios.get(
            `${SERVER_URL}/api/shop/get-by-city/${city}`,
            {
                withCredentials: true,
            }
        );
        return res.data;
    },

    getMyShop: async () => {
        const res = await axios.get(`${SERVER_URL}/api/shop/get-my`, {
            withCredentials: true,
        });
        return res.data;
    },

    getItemsByCity: async (city) => {
        const res = await axios.get(
            `${SERVER_URL}/api/item/get-by-city/${city}`,
            {
                withCredentials: true,
            }
        );
        return res.data;
    },

    createEditShop: async (formData) => {
        const res = await axios.post(`${SERVER_URL}/api/shop/create-edit`, formData, {
            withCredentials: true,
        });
        return res.data;
    },

    addItem: async (formData) => {
        const res = await axios.post(
            `${SERVER_URL}/api/item/add-item`,
            formData,
            {
                withCredentials: true,
            }
        );
        return res.data;
    },

    editItem: async (itemId, formData) => {
        const res = await axios.post(
            `${SERVER_URL}/api/item/edit-item/${itemId}`,
            formData,
            {
                withCredentials: true,
            }
        );
        return res.data;
    },

    deleteItem: async (itemId) => {
        const res = await axios.delete(`${SERVER_URL}/api/item/delete/${itemId}`, {
            withCredentials: true,
        });
        return res.data;
    },

    getItemById: async (itemId) => {
        const res = await axios.get(
            `${SERVER_URL}/api/item/get-by-id/${itemId}`,
            { withCredentials: true }
        );
        return res.data;
    },

    getItemsByShop: async (shopId) => {
        const res = await axios.get(
            `${SERVER_URL}/api/item/get-by-shop/${shopId}`,
            { withCredentials: true }
        );
        return res.data;
    },

    searchItems: async (query, city) => {
        const res = await axios.get(
            `${SERVER_URL}/api/item/search-items?query=${query}&city=${city}`,
            { withCredentials: true }
        );
        return res.data;
    },

    addRating: async (itemId, rating) => {
        const res = await axios.post(
            `${SERVER_URL}/api/item/rating`,
            { itemId, rating },
            { withCredentials: true }
        );
        return res.data;
    }
};

export default shopApi;
