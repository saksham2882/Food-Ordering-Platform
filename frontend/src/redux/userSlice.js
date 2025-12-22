import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isCheckingAuth: true,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        shopsInMyCity: null,
        itemsInMyCity: null,
        cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
        totalAmount: JSON.parse(localStorage.getItem("totalAmount")) || 0,
        myOrders: [],
        searchItems: null,
        socket: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
            state.isCheckingAuth = false
        },
        setCheckingAuth: (state, action) => {
            state.isCheckingAuth = action.payload
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        addToCart: (state, action) => {
            const cartItem = action.payload
            const existingItem = state.cartItems.find(i => i.id == cartItem.id)

            if (existingItem) {
                existingItem.quantity += cartItem.quantity
            } else {
                state.cartItems.push(cartItem)
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

            // Sync to LocalStorage
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload
            const item = state.cartItems.find(i => i.id == id)
            if (item) {
                item.quantity = quantity
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload
        },
        addMyOrder: (state, action) => {
            state.myOrders = [action.payload, ...state.myOrders]
        },
        updateOrderStatus: (state, action) => {
            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id == orderId)
            if (order) {
                if (order.shopOrders && order.shopOrders.shop._id == shopId) {
                    order.shopOrders.status = status
                }
            }
        },
        updateRealTimeOrderStatus: (state, action) => {
            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id == orderId)
            if (order) {
                const shopOrder = order.shopOrders.find(so => so.shop._id == shopId)
                if (shopOrder) {
                    shopOrder.status = status
                }
            }
        },
        setSearchItems: (state, action) => {
            state.searchItems = action.payload
        }
    }
})

export const { setUserData, setCheckingAuth, setCurrentCity, setCurrentState, setCurrentAddress, setShopsInMyCity, setItemsInMyCity, addToCart, updateQuantity, removeCartItem, setMyOrders, addMyOrder, updateOrderStatus, setSearchItems, setSocket, updateRealTimeOrderStatus } = userSlice.actions
export default userSlice.reducer