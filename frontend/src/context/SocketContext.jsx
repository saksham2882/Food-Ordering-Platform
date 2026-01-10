import { SERVER_URL } from "@/App";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        // Initialize Socket
        const socketInstance = io(SERVER_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        setSocket(socketInstance);

        // Setup Listeners
        socketInstance.on("connect", () => {
            if (userData?._id) {
                socketInstance.emit("identity", { userId: userData._id });
            }
        });

        socketInstance.on("disconnect", () => {
            console.log("Socket disconnected");
        })

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        }
    }, []);

    // Update identity when userData changes (e.g., login/logout)
    useEffect(() => {
        if (socket && userData?._id) {
            socket.emit("identity", { userId: userData._id });
        }
    }, [userData, socket])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
