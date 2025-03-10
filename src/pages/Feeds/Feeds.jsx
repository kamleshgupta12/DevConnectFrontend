import React from "react";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

const Feeds = () => {
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
            <Link to="/dashboard/feed" className="text-[#308d46] font-medium">Explore Learning</Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-lg text-center m-4 sm:text-2xl font-bold text-white">Learn & Test Yourself</h1>

      <div className="w-full max-w-lg mx-auto p-4 sm:p-6 flex flex-col items-center rounded-md text-center border border-richblack-600 bg-richblack-800">
        <p className="text-sm sm:text-base text-richblack-300 mt-1 sm:mt-2">
          Watch educational tutorials or test your knowledge with interactive quizzes.
        </p>

        {/* Buttons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
          {/* Tutorials Button */}
          <Link to="/dashboard/learning/tutorials">
            <button className="w-full h-[50px] sm:h-[60px] border border-richblack-600 bg-[#308d46] text-white rounded-md shadow-md hover:bg-[#267038] transition flex justify-center items-center gap-2 font-semibold text-sm sm:text-base">
              <FaFileAlt className="text-base sm:text-lg" /> View Tutorials
            </button>
          </Link>

          {/* Quiz Button */}
          <Link to="/dashboard/learning/quizzes">
            <button className="w-full h-[50px] sm:h-[60px] border border-richblack-600 bg-[#308d46] text-white rounded-md shadow-md hover:bg-[#267038] transition flex justify-center items-center gap-2 font-semibold text-sm sm:text-base">
              <MdQuiz className="text-base sm:text-lg" /> Take a Quiz
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Feeds;
