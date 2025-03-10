import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const socket = io(process.env.REACT_APP_SOCKET_BASE_URL);
console.log(process.env.REACT_APP_SOCKET_BASE_URL,"process");

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [commentingPostId, setCommentingPostId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalComments, setModalComments] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserId(parsedData._id);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
        socket.on("postUpdated", (updatedPost) => {
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
            );
        });
        return () => socket.off("postUpdated");
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/course/post-feeds`);
            if (res.data && Array.isArray(res.data.posts)) {
                setPosts(res.data.posts);
            } else {
                throw new Error("Invalid API response format");
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const handleLike = (postId, isLiked) => {
        socket.emit("likePost", { postId, userId });
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post._id === postId
                    ? { ...post, likes: isLiked ? post.likes.filter((id) => id !== userId) : [...post.likes, userId] }
                    : post
            )
        );
    };

    const handleCommentClick = (postId) => {
        setCommentingPostId(commentingPostId === postId ? null : postId);
        setCommentText("");
    };

    const handleCommentSubmit = (postId) => {
        if (commentText.trim()) {
            socket.emit("commentPost", { postId, userId, text: commentText });
            setCommentText("");
            setCommentingPostId(null);
        }
    };

    const openCommentsModal = (comments) => {
        setModalComments(comments);
        setModalOpen(true);
    };

    const ClickHandler = async (_id) => {
        const id = _id
        localStorage.setItem('id', id)
        navigate('/dashboard/user-profile')
    }

    return (
        <div className="bg-richblack-900 min-h-screen flex justify-center p-6">
            <div className="w-full max-w-6xl">
                <nav className="text-md font-medium text-richblack-300 mb-6">
                    <ul className="flex space-x-2">
                        <li><Link to="/" className="hover:text-[#308d46] transition">Home</Link></li>
                        <span className="text-richblack-400">/</span>
                        <li><Link to="/dashboard/learning" className="hover:text-[#308d46] transition">Learning</Link></li>
                        <span className="text-richblack-400">/</span>
                        <li><Link to="/dashboard/learning/tutorials" className="text-[#308d46] font-medium">Tutorials</Link></li>
                    </ul>
                </nav>
                <h2 className="text-3xl font-bold text-center mb-6 text-richblack-50">Post</h2>
                {posts.length === 0 ? (
                    <p className="text-center text-white">No posts available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            const isLiked = post.likes.includes(userId);
                            return (
                                <div key={post._id} className="bg-[#161D29] rounded-lg shadow-md overflow-hidden">
                                    {/* User Info */}
                                    <div className="flex items-center p-4 border-b border-richblack-700 justify-between">
                                        <div onClick={() => ClickHandler(post.userId && post.userId._id)} className="flex 
                                        justify-center items-center cursor-pointer">
                                            <img
                                                src={post.userId && post.userId.image}
                                                alt=''
                                                className="w-10 h-10 rounded-full border border-richblack-600"
                                            />
                                            <span className="ml-2 text-sm font-semibold text-richblack-5">
                                                {post.userId && post.userId.firstName} {post.userId && post.userId.lastName}
                                            </span>
                                        </div>
                                        <button className="text-richblack-100 border p-1 px-2 rounded-md">Follow</button>
                                    </div>

                                    <div className="p-1 px-4">
                                        <p className="text-richblack-50 text-lg">{post.title}</p>
                                        <p className="text-richblack-200 text-sm">{post.content}</p>
                                    </div>
                                    {/* Post Media */}
                                    <div className="p-4">
                                        {post.videoUrl ? (
                                            <video
                                                src={post.videoUrl}
                                                controls
                                                className="w-full h-50 object-cover rounded-md"
                                            />
                                        ) : post.thumbnail ? (
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full h-50 object-cover rounded-md cursor-pointer"
                                                onClick={() => setSelectedImage(post.thumbnail)}
                                            />
                                        ) : (
                                            <p className="text-richblack-50">{post.code}</p>
                                        )}
                                    </div>

                                    {/* Like & Comment Buttons */}
                                    <div className="flex items-center justify-between px-4 py-2 border-t border-richblack-700">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleLike(post._id, isLiked)}>
                                                {isLiked ? (
                                                    <FaHeart size={24} className="text-[#EB4034]" />
                                                ) : (
                                                    <FaRegHeart size={24} className="text-richblack-100" />
                                                )}
                                            </button>
                                            <button onClick={() => handleCommentClick(post._id)} className="text-richblack-100">
                                                <FaComment size={24} />
                                            </button>
                                        </div>
                                        <span className="text-richblack-400 text-sm">{post.likes.length} likes</span>
                                    </div>
                                    {commentingPostId === post._id && (
                                        <div className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="w-full px-3 py-2 rounded-md bg-richblack-700 text-white border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-richblack-500"
                                            />
                                            <button
                                                onClick={() => handleCommentSubmit(post._id)}
                                                className="mt-2 px-4 py-2 bg-[#308D46] text-white rounded-md "
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    )}
                                    {/* Comments Section */}
                                    <div className="px-4 py-2">
                                        {post.comments && post.comments.length > 0 && (
                                            <>
                                                <ul className="mt-2 space-y-1">
                                                    <li key={post.comments[post.comments.length - 1]._id} className="flex items-center space-x-2 text-richblack-300">
                                                        <img
                                                            src={post.comments[post.comments.length - 1].userId?.image}
                                                            alt="User"
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div>
                                                            <p className="text-[10px]">{post.comments[post.comments.length - 1].userId?.firstName}</p>
                                                            <span className="text-[14px] text-richblack-25">{post.comments[post.comments.length - 1].text}</span>
                                                        </div>
                                                    </li>
                                                </ul>

                                                {post.comments.length > 1 && (
                                                    <button
                                                        className="text-[#308D46] hover:underline mt-1 text-sm"
                                                        onClick={() => openCommentsModal(post.comments)}
                                                    >
                                                        See more comments...
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Comments Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="bg-richblack-5 p-6 rounded-md max-w-lg w-full h-[30vh] overflow-y-auto">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold mb-4 ">All Comments</h3>
                                <button className="text-[#EB4034] font-bold border px-2 p-1 rounded" onClick={() => setModalOpen(false)}>
                                    Close
                                </button>
                            </div>

                            <ul className="space-y-2">
                                {modalComments.map((c, index) => (
                                    <li key={index} className="flex items-center space-x-2 text-black">
                                        <img src={c.userId?.image} alt="User" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-sm font-semibold">{c.userId?.firstName}</p>
                                            <span className="text-sm">{c.text}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {selectedImage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[9999]">
                        <div className="relative p-4 pt-12 bg-richblack-5 rounded-md w-[60%]">
                            <button
                                className="absolute top-2  right-2 text-[#EB4034] font-bold border p-2 px-2 py-1 rounded"
                                onClick={() => setSelectedImage(null)}
                            >
                                Close
                            </button>
                            <img src={selectedImage} alt="Selected Post" className="w-[70vw] max-h-[60vh] rounded-md" />
                            <h1 className="text-center mt-6 font-bold text-2xl">Title</h1>
                            <span>Discover five VS Code extensions that can replace standalone development tools,
                                reducing resource usage and context switching. The highlighted extensions include
                                Thunder Client for API development, BlackBox AI as an AI coding assistant, Time Master
                                for time tracking, Dendron for knowledge management, and GitDoc for automatic
                                Discover five VS Code extensions that can replace standalone development tools,
                                reducing resource usage and context switching. The highlighted extensions include
                                Thunder Client for API development, BlackBox AI as an AI coding assistant, Time Master
                                for time tracking, Dendron for knowledge management, and GitDoc for automatic
                                Discover five VS Code extensions that can replace standalone development tools,
                                reducing resource usage and context switching. The highlighted extensions include Thunder
                                Client for API development, BlackBox AI as an AI coding assistant, Time Master for time tracking,
                                Dendron for knowledge management, and GitDoc for automatic
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;
