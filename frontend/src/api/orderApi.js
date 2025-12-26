import axios from "axios";
import { SERVER_URL } from "../App";

const orderApi = {
    getMyOrders: async () => {
        const res = await axios.get(`${SERVER_URL}/api/order/my-orders`, {
            withCredentials: true,
        });
        return res.data;
    },

    placeOrder: async (orderData) => {
        const res = await axios.post(
            `${SERVER_URL}/api/order/place-order`,
            orderData,
            { withCredentials: true }
        );
        return res.data;
    },

    verifyPayment: async (paymentData) => {
        const res = await axios.post(`${SERVER_URL}/api/order/verify-payment`, paymentData, {
            withCredentials: true
        });
        return res.data;
    },

    getOrderById: async (orderId) => {
        const res = await axios.get(
            `${SERVER_URL}/api/order/get-order-by-id/${orderId}`,
            { withCredentials: true }
        );
        return res.data;
    },

    getAssignments: async () => {
        const res = await axios.get(`${SERVER_URL}/api/order/get-assignments`, {
            withCredentials: true,
        });
        return res.data;
    },

    getCurrentOrder: async () => {
        const res = await axios.get(`${SERVER_URL}/api/order/get-current-order`, {
            withCredentials: true,
        });
        return res.data;
    },

    acceptOrder: async (assignmentId) => {
        const res = await axios.get(
            `${SERVER_URL}/api/order/accept-order/${assignmentId}`,
            { withCredentials: true }
        );
        return res.data;
    },

    sendDeliveryOtp: async (data) => {
        const res = await axios.post(
            `${SERVER_URL}/api/order/send-delivery-otp`,
            data,
            { withCredentials: true }
        );
        return res.data;
    },

    verifyDeliveryOtp: async (data) => {
        const res = await axios.post(
            `${SERVER_URL}/api/order/verify-delivery-otp`,
            data,
            { withCredentials: true }
        );
        return res.data;
    },

    getTodayDeliveries: async () => {
        const res = await axios.get(`${SERVER_URL}/api/order/get-today-deliveries`, { withCredentials: true });
        return res.data;
    },

    updateOrderStatus: async (orderId, shopId, status) => {
        const res = await axios.post(
            `${SERVER_URL}/api/order/update-status/${orderId}/${shopId}`,
            { status },
            { withCredentials: true }
        );
        return res.data;
    }
};

export default orderApi;
