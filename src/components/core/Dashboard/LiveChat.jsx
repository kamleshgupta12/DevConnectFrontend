import { io } from "socket.io-client";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Welcome from "./Chat/Welcome";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import "./index.css";
import { BsFillSendFill } from "react-icons/bs";
import { getAllUserApi } from "../../../services/api/allUserAPI";
import { setAllUser } from "../../../slices/Allusers";
import { useDispatch, useSelector } from "react-redux";
import { FaApple, FaComments, FaGooglePlay } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";
import { motion } from "framer-motion";


const socket = io(process.env.REACT_APP_SOCKET_BASE_URL);

export default function ChatPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = localStorage.getItem("id");
    const { allUsers } = useSelector((state) => state.allusers);

    const fetchUsers = async () => {
        try {
            const response = await getAllUserApi();
            dispatch(setAllUser(response.allUser));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (allUsers.length > 0) {
            setUsers(allUsers);
            setFilteredUsers(allUsers);
        }

        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => socket.off("receiveMessage");
    }, [allUsers]);

    useEffect(() => {
        const filtered = users.filter((user) =>
            `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const sendMessage = () => {
        if (!input.trim() || !selectedUser) return;

        const newMessage = {
            senderId: userId,
            receiverId: selectedUser._id,
            message: input,
            timestamp: new Date(),
        };

        socket.emit("sendMessage", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
    };

    const exitHandler = () => {
        setSelectedUser(null)
    };

    return (
     <>
        <div className="hidden md:flex h-[85vh]">
            <div className="w-1/3 bg-gray-200 border border-richblack-700 rounded-l-lg flex flex-col overflow-hidden">
                <div className="bg-richblack-900 p-4 sticky top-0 left-0 right-0 z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-richblack-50">Chats</h2>
                        <BsThreeDotsVertical className="text-richblack-5 text-xl" />
                    </div>
                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border border-richblack-700 rounded-md bg-richblack-800 text-richblack-100 focus:outline-none focus:ring-2 focus:ring-[#308d46]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1  mt-3">
                        <button className="bg-[#308d46] bg-opacity-50 px-4 py-1 rounded-full text-richblack-5">
                            All
                        </button>
                        <button className="bg-richblack-600 px-4 py-1 rounded-full text-richblack-5">
                            Unread
                        </button>
                        <button className="bg-richblack-600 px-4 py-1 rounded-full text-richblack-5">
                            Favourites
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className={`flex items-center gap-3 p-3 cursor-pointer 
                                ${selectedUser?._id === user._id
                                    ? "bg-richblack-600 text-white"
                                    : "bg-richblack-800 border-b border-richblack-700"
                                }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={user.image}
                                alt={user.firstName}
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="text-richblack-5">
                                {user.firstName} {user.lastName}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col border border-richblack-700 border-l-0 rounded-r-lg overflow-hidden">
                <div className="bg-[#161D29] text-white p-4 font-bold rounded-tr-lg">
                    {selectedUser ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.firstName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </span>
                            </div>
                            <IoCloseSharp onClick={()=>exitHandler()} className="text-richblack-5 cursor-pointer text-3xl text-[#d41124]" />
                        </div>
                    ) : (
                        <Welcome />
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100 flex flex-col ">
                    {messages
                        .filter(
                            (msg) =>
                                (msg.senderId === userId &&
                                    msg.receiverId === selectedUser?._id) ||
                                (msg.senderId === selectedUser?._id &&
                                    msg.receiverId === userId)
                        )
                        .map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-lg  flex justify-between  max-w-[300px] gap-1
                                ${msg.senderId === userId
                                        ? "ml-auto bg-[#308d46] text-white bg-opacity-80"
                                        : "mr-auto bg-gray-300 text-black"
                                    }`}
                            >
                                <p>{msg.message}</p>
                                <span className="text-[10px] flex items-end">
                                    {moment(msg.timestamp).format("HH:mm")}
                                </span>
                            </div>
                        ))}
                </div>
                {selectedUser && (
                    <div className="flex items-center p-3 border-t bg-richblack-600 rounded-br-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 text-richblack-5 p-2 border border-richblack-300 bg-richblack-400 rounded-lg outline-none"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 p-3 bg-[#308d46] font-semibold text-white rounded-lg"
                        >
                            <BsFillSendFill />
                        </button>
                    </div>
                )}
            </div>
        </div>
        <div className="md:hidden h-[85vh] flex flex-col items-center justify-center bg-[#161D29] text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex justify-center">
          <FaComments className="text-6xl text-[#308d46] mb-4 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-richblack-5">
          Download <span className="text-[#308d46]">DevConnect App</span>
        </h1>
        <p className="text-lg mb-6 text-richblack-100">
          Enjoy a seamless Peer-to-Peer chat experience for developers.
        </p>

        {/* App Store Buttons */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://play.google.com/store" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#308d46] px-4 py-2 rounded-lg text-white font-medium shadow-md hover:bg-green-700 transition"
          >
            <FaGooglePlay className="text-2xl" />
            <span>Get it on Google Play</span>
          </a>

          <a
            href="https://www.apple.com/app-store/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#161D29] border border-white px-4 py-2 rounded-lg text-white font-medium shadow-md hover:bg-white hover:text-black transition"
          >
            <FaApple className="text-2xl" />
            <span>Download on the App Store</span>
          </a>
        </div>
      </motion.div>
    </div>
     </>
    );
}
