import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCloudUpload } from "react-icons/md";

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

const Tutorial = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let imageUrl = "";

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);
        imageFormData.append("upload_preset", "CodeGrage");
        imageFormData.append("cloud_name", "dhdp6aarr");
        imageFormData.append("folder", "CodeGrage");
        imageFormData.append("resource_type", "image");

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dhdp6aarr/image/upload",
          imageFormData
        );

        imageUrl = cloudinaryResponse.data.secure_url;
      }

      const formData = {
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags.split(",").map(tag => tag.trim()),
        thumbnail: imageUrl,
        userId: user._id,
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
        toast.success("Blog added successfully!");
        navigate("/dashboard/learning/tutorials");
      } else {
        toast.error(response.data.message || "Failed to add blog");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading blog");
    }

    setLoading(false);
  };

  return (
    <>
      <LoadingModal isOpen={loading} />
      <nav className="text-md font-medium text-richblack-300 mb-6">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="hover:text-[#308d46]">Home</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/post" className="hover:text-[#308d46]">Choose Post</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/tutorial" className="text-[#308d46]">Create Tutorial</Link>
          </li>
        </ul>
      </nav>
      <h2 className="text-2xl font-semibold mb-4 text-richblack-5 text-center">Create Tutorial</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-6">
        <div className="text-richblack-100">
          <label htmlFor="title" className="block text-sm font-medium text-richblack-200 mb-2">
            Tutorial Title <sup className="text-[#b21616]">*</sup>
          </label>
          <input
            id="title"
            placeholder="Enter Tutorial Title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100"
          />
          {errors.title && <span className="text-[#b21616] text-sm mt-1">{errors.title.message}</span>}
        </div>

        <div className="text-richblack-100">
          <label htmlFor="category" className="block text-sm font-medium text-richblack-200 mb-2">
            Category <sup className="text-[#b21616]">*</sup>
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100"
          >
            <option value="">Select a category</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Others">Others</option>
          </select>
          {errors.category && <span className="text-[#b21616] text-sm mt-1">{errors.category.message}</span>}
        </div>

        <div className="text-richblack-100">
          <label htmlFor="tags" className="block text-sm font-medium text-richblack-200 mb-2">
            Tags <sup className="text-[#b21616]">*</sup>
          </label>
          <input
            id="tags"
            placeholder="Enter tags (comma-separated)"
            {...register("tags", { required: "Tags are required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100"
          />
          {errors.tags && <span className="text-[#b21616] text-sm mt-1">{errors.tags.message}</span>}
        </div>

        <div className="text-richblack-100">
          <label htmlFor="content" className="block text-sm font-medium text-richblack-200 mb-2">
            Content <sup className="text-[#b21616]">*</sup>
          </label>
          <textarea
            id="content"
            placeholder="Enter Tutorial Content"
            {...register("content", { required: "Content is required" })}
            className="w-full px-3 py-2 rounded-md bg-richblack-700 text-richblack-100 h-[150px]"
          />
          {errors.content && <span className="text-[#b21616] text-sm mt-1">{errors.content.message}</span>}
        </div>

        <div className="text-richblack-100">
          <label htmlFor="image" className="block text-sm font-medium text-richblack-200 mb-2">
            Upload Thumbnail <sup className="text-[#b21616]">*</sup>
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-richblack-500 rounded-lg cursor-pointer bg-richblack-700 hover:border-richblack-300 transition-all">
              <div className="flex flex-col items-center justify-center py-5">
                <MdOutlineCloudUpload className="text-4xl text-[#308d46]" />
                {selectedFile ? (
                  <p className="text-sm text-green-400 mt-2">{selectedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-richblack-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-richblack-500">JPG, PNG, up to 15MB</p>
                  </>
                )}
              </div>
              <input
                id="image"
                type="file"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.image && <span className="text-[#b21616] text-sm mt-1">{errors.image.message}</span>}
        </div>

        <div className=" flex justify-end items-center gap-2">
          <div>
            <button
              type="submit"
              className="w-[100px] bg-[#308d46] font-bold text-white py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Blog"}
            </button>
          </div>
          <div>
            <Link to="/dashboard/post">
              <button
                type="text"
                className="w-[100px] bg-richblack-400 text-white py-3 rounded-md hover:bg-green-700 transition-all disabled:bg-green-400"
              >
                Cancel
              </button></Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default Tutorial;
