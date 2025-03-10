import React from "react";
import { Link } from "react-router-dom";
import { FaBookOpenReader } from "react-icons/fa6";
import { MdPermMedia } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";

const PostComponent = () => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="text-sm sm:text-md font-medium text-richblack-300 mb-4 sm:mb-6">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="hover:text-[#308d46]">Home</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/post" className="text-[#308d46] font-medium">Choose Post</Link>
          </li>
        </ul>
      </nav>

      {/* Page Title */}
      

      {/* Post Selection Container */}
      <div className="w-100  mx-auto p-4 sm:p-6 flex flex-col items-center rounded-lg justify-center ">
        
        {/* Heading and Description */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-white">Create a New Post</h1>
          <p className="text-sm sm:text-base text-richblack-300 mt-1">
            Share your knowledge by posting tutorials, media content, or code.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* Tutorial */}
          <Link to="/dashboard/tutorial" aria-label="Post a Tutorial">
            <button className="w-full sm:w-auto min-w-[140px] sm:min-w-[170px] h-[50px] sm:h-[55px] border border-richblack-600 bg-[#308d46] text-white rounded-md shadow-md hover:bg-green-700 transition flex justify-center items-center gap-2 font-semibold text-sm sm:text-base px-3 sm:px-4">
              <FaBookOpenReader className="text-base sm:text-lg" /> Post Tutorial
            </button>
          </Link>

          {/* Media */}
          <Link to="/dashboard/media" aria-label="Post Media Tutorial">
            <button className="w-full sm:w-auto min-w-[140px] sm:min-w-[170px] h-[50px] sm:h-[55px] border border-richblack-600 bg-[#308d46] text-white rounded-md shadow-md hover:bg-green-700 transition flex justify-center items-center gap-2 font-semibold text-sm sm:text-base px-3 sm:px-4">
              <MdPermMedia className="text-base sm:text-lg" /> Post Media
            </button>
          </Link>

          {/* Code */}
          <Link to="/dashboard/code" aria-label="Post Code">
            <button className="w-full sm:w-auto min-w-[140px] sm:min-w-[170px] h-[50px] sm:h-[55px] border border-richblack-600 bg-[#308d46] text-white rounded-md shadow-md hover:bg-green-700 transition flex justify-center items-center gap-2 font-semibold text-sm sm:text-base px-3 sm:px-4">
              <FaLaptopCode className="text-base sm:text-lg" /> Post Code
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostComponent;
