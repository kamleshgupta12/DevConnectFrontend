import { io } from "socket.io-client";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { BsFillSendFill } from "react-icons/bs";
import Welcome from "./Chat/Welcome";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserApi } from "../../../services/api/allUserAPI";
import { setAllUser } from "../../../slices/Allusers";
import "./index.css";

const socket = io(process.env.REACT_APP_SOCKET_BASE_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default function ChatPage() {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { allUsers } = useSelector((state) => state.allusers);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        socket.connect();
        socket.emit("registerUser", userId);

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        const handleReceiveMessage = (newMessage) => {
            if (
                (newMessage.senderId === selectedUser?._id && newMessage.receiverId === userId) ||
                (newMessage.senderId === userId && newMessage.receiverId === selectedUser?._id)
            ) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [selectedUser, userId]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Fetch users list
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUserApi();
                dispatch(setAllUser(response.allUser));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [dispatch]);

    // Filter users based on search term
    useEffect(() => {
        setFilteredUsers(
            allUsers.filter((user) =>
                `${user.firstName} ${user.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, allUsers]);
    useEffect(() => {
        if (!selectedUser) return;

        const roomId = [userId, selectedUser._id].sort().join("-");
        socket.emit("joinRoom", roomId);

        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/chat/${userId}/${selectedUser._id}`
                );
                const data = await response.json();
                setMessages(data.messages);
                // Scroll to bottom after initial messages load
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
                }, 100);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();

        return () => {
            socket.emit("leaveRoom", roomId);
        };
    }, [selectedUser, userId]);

    const sendMessage = () => {
        if (!input.trim() || !selectedUser) return;

        const tempId = Date.now();
        const newMessage = {
            _id: tempId,
            senderId: userId,
            receiverId: selectedUser._id,
            message: input,
            timestamp: new Date(),
            isOptimistic: true
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        socket.emit("sendMessage", {
            senderId: userId,
            receiverId: selectedUser._id,
            message: input
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="h-[85vh] flex border rounded-lg border-richblack-600 overflow-hidden">
            <div className="w-1/3 bg-gray-200 border-r border-richblack-600 flex flex-col">
                <div className="bg-richblack-900 p-4 text-white sticky top-0 z-10">
                    <h2 className="text-2xl font-bold">Chats</h2>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 rounded bg-richblack-600 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto bg-richblack-800 custom-scrollbar">
                    {filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className={`p-3 cursor-pointer flex items-center gap-2 border-b border-richblack-600 text-richblack-5 
                ${selectedUser?._id === user._id ? "bg-richblack-400 text-white" : "bg-gray-800"}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img src={user.image} alt={user.firstName} className="w-10 h-10 rounded-full" />
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    ))}
                </div>
            </div>  

            <div className="w-2/3 flex flex-col">
                <div className="bg-[#101820] text-richblack-5 p-4 flex justify-between border-b border-richblack-600">
                    {selectedUser ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src={selectedUser.image} alt={selectedUser.firstName} className="w-10 h-10 rounded-full" />
                                <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                            </div>
                        </div>
                    ) : (
                        <Welcome />
                    )}
                </div>

                <div
                    className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
                    ref={messagesContainerRef}
                >
                    {messages.map((msg, index) => {
                        const isSender = msg.senderId === userId;
                        const sender = isSender ? user : selectedUser;

                        return (
                            <div key={msg._id || index} className={`flex items-end space-x-2 ${isSender ? "justify-end" : "justify-start"}`}>
                                {!isSender && (
                                    <img
                                        src={sender?.image}
                                        alt={sender?.firstName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}

                                <div
                                    className={`px-3 py-1 text-sm shadow-md break-words w-auto min-w-[10%] max-w-[65%] ${isSender
                                        ? "ml-auto bg-[#25D366] text-white rounded-2xl rounded-br-sm bg-opacity-55"
                                        : "mr-auto bg-richblack-200 text-black rounded-2xl rounded-bl-sm"
                                        }`}
                                >
                                    <p className="leading-relaxed">{msg.message}</p>
                                    <span className="text-[10px] text-gray-500 block text-right mt-1">
                                        {moment(msg.timestamp).format("HH:mm")}
                                    </span>
                                </div>

                                {isSender && (
                                    <img
                                        src={sender?.image}
                                        alt={sender?.firstName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {selectedUser && (
                    <div className="p-4 border-t border-richblack-600 flex items-center bg-richblack-800">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 p-2 rounded bg-richblack-400 text-richblack-50 outline-none"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 p-3 bg-[#308d46] text-white rounded"
                            disabled={!input.trim()}
                        >
                            <BsFillSendFill />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}