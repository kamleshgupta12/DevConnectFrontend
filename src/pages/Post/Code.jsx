import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-richblack-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold text-white">Uploading...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
        </div>
      </div>
    </div>
  );
};

const Code = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        title: data.title,
        code: data.code,
        userId: user._id
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/profile/video-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Code submitted successfully!");
        navigate("/dashboard/learning/tutorials");
      } else {
        toast.error(response.data.message || "Failed to submit code");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting code");
    }
    setLoading(false);
  };

  return (
    <>
      <LoadingModal isOpen={loading} />
      <nav className="text-md font-medium text-richblack-300 mb-6">
        <ul className="flex space-x-2">
          <li><Link to="/" className="hover:text-[#308d46] transition">Home</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/dashboard/post" className="hover:text-[#308d46] transition">Choose Post</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/posts" className="text-[#308d46] font-medium">Post Code</Link></li>
        </ul>
      </nav>
      <h2 className="text-2xl font-semibold mb-4 text-richblack-5 text-center">Post Code</h2>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-richblack-800 rounded-md border border-richblack-700 p-6 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2 text-richblack-200">
            Code Title <sup className="text-[#b21616]">*</sup>
          </label>
          <input
            id="title"
            placeholder="Enter Code Title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 rounded-md border border-richblack-600 bg-richblack-700 text-white focus:outline-none focus:ring focus:ring-green-500"
          />
          {errors.title && <span className="text-[#b21616] text-sm mt-1">{errors.title.message}</span>}
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-2 text-richblack-200">
            Enter Code <sup className="text-[#b21616]">*</sup>
          </label>
          <textarea
            id="code"
            placeholder="Enter your code here"
            {...register("code", { required: "Code is required" })}
            className="w-full px-3 py-2 rounded-md border border-richblack-600 bg-richblack-700 text-white h-40 font-mono focus:outline-none focus:ring focus:ring-green-500"
          />
          {errors.code && <span className="text-[#b21616] text-sm mt-1">{errors.code.message}</span>}
        </div>

        <div className="flex justify-end items-center gap-2">
          <button 
            type="submit"
            className="w-[100px] bg-[#308d46] text-white py-3 rounded-md hover:bg-green-700 transition-all disabled:bg-green-400"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Code"}
          </button>
          <Link to='/dashboard/post'>
          <button 
            type="text"
            className="w-[100px] bg-richblack-400 text-white py-3 rounded-md hover:bg-green-700 transition-all disabled:bg-green-400"
          >
            Cancel
          </button>
          </Link>
        </div>
      </form>
    </>
  );
};

export default Code;
