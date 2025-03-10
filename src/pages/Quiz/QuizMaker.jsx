import { Link } from "react-router-dom";


const QuizMaker = ({ user, userFollowStats }) => {


  return (
    <>
      <nav className="text-md font-medium text-richblack-300 mb-1">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="hover:text-[#308d46]">Home</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/post" className="text-[#308d46] font-medium">Create Quiz System</Link>
          </li>
        </ul>
      </nav>
      
      <div className=" mx-auto flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md" >
        <h1 className="text-3xl font-bold mb-6 text-richblack-50">Create Quiz </h1>
        <Link to="/dashboard/create-quiz" className="bg-[#308d46] text-white px-4 py-2 rounded-lg">Create a Quiz</Link>
      </div>
    </>
  );
};

export default QuizMaker;
