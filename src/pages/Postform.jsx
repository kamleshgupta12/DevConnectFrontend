import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold">Uploading...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
        </div>
      </div>
    </div>
  );
};

const Postform = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const videoFormData = new FormData();
      videoFormData.append("file", data.video[0]);
      videoFormData.append("upload_preset", "CodeGrage");
      videoFormData.append("cloud_name", "dhdp6aarr");
      videoFormData.append("folder", "CodeGrage");
      videoFormData.append("resource_type", "video");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dhdp6aarr/video/upload",
        videoFormData
      );

      const videoUrl = cloudinaryResponse.data.secure_url;

      const formData = {
        title: data.title,
        description: data.description,
        code: data.code,
        videoUrl: videoUrl,
        userId: user._id
      };

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/profile/video-upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Post added successfully!");
        navigate("/dashboard/learning/tutorials");
      } else {
        toast.error(response.data.message || "Failed to add Post");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading Post");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Show Loading Modal */}
      <LoadingModal isOpen={loading} />
      <nav className="text-md font-medium text-richblack-300 mb-6">
        <ul className="flex space-x-2">
          <li><Link to="/" className="hover:text-[#308d46] transition">Home</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/dashboard/post" className="hover:text-[#308d46] transition">Choose Post</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/posts" className="text-[#308d46] font-medium">Post Media</Link></li>
        </ul>
      </nav>
      <h2 className="text-2xl font-semibold mb-4 text-richblack-5 text-center">Post Media File</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8">
        <div className="text-richblack-100">
          <label htmlFor="title">
            Post Title<sup className="text-[red]">*</sup>
          </label>
          <input
            id="title"
            placeholder="Enter Post Title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100"
          />
          {errors.title && <span className="text-[red]">{errors.title.message}</span>}
        </div>

        <div className="text-richblack-100">
          <label htmlFor="description">
            Post Description<sup className="text-[red]">*</sup>
          </label>
          <textarea
            id="description"
            placeholder="Enter Description"
            {...register("description", { required: "Description is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100 h-[150px]"
          />
          {errors.description && <span className="text-[red]">{errors.description.message}</span>}
        </div>
        {/* 
        <div className="text-richblack-100">
          <label htmlFor="code">
            Code<sup className="text-[red]">*</sup>
          </label>
          <textarea
            id="code"
            placeholder="Enter Code"
            {...register("code", { required: "Code is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100 h-[150px]"
          />
          {errors.code && <span className="text-[red]">{errors.code.message}</span>}
        </div> */}

        <div className="text-richblack-100">
          <label htmlFor="video">
            Upload Video<sup className="text-[red]">*</sup>
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            {...register("video", { required: "Video is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100"
          />
          {errors.video && <span className="text-[red]">{errors.video.message}</span>}
        </div>

        <div className="flex justify-end items-center gap-2">
          <button
            type="submit"
            className="w-[100px] bg-[#308d46] font-bold text-white py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
          <Link to="/dashboard/post">
            <button
              type="text"
              className="w-[100px] bg-richblack-400 text-white py-3 rounded-md hover:bg-green-700 transition-all disabled:bg-green-400"
            >
              Cancel
            </button></Link>
        </div>
      </form>
    </>
  );
};

export default Postform;
