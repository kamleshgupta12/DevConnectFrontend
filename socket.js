import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_BASE_URL, {
    withCredentials: true, 
    transports: ["websocket"], // Ensures stable connection
});

export default socket;
