import React, { useState, useEffect } from "react";
import axios from "axios";
import Quiz from "react-quiz-component";
import { Link } from "react-router-dom";
import './Style.css'

const TotalQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/get-quiz`);
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to load quizzes");
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#161D29] p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold text-richblack-5">Loading quizzes...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#308d46]"></div>
        </div>
      </div>
    </div>
  );

  if (error) return <div className="text-center mt-10 text-xl text-red-600">{error}</div>;

  return (
    <>
      <nav className="text-md font-medium text-richblack-300 mb-6">
        <ul className="flex space-x-2">
          <li><Link to="/" className="hover:text-[#308d46] transition">Home</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/dashboard/learning" className="hover:text-[#308d46] transition">Learning</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/posts" className="text-[#308d46] font-medium">Take Quiz</Link></li>
        </ul>
      </nav>
      <div className=" bg-richblack-900 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Test Your Knowledge</h2>
        <div className="w-full max-w-3xl p-8 bg-[#161D29] rounded-lg shadow-lg border border-richblack-700 flex flex-col items-center">
          {!selectedQuiz && (
            <div className="w-full flex flex-wrap justify-center gap-4">
              {quizzes.map((quiz) => (
                <button
                  key={quiz._id}
                  className="flex-1 min-w-[200px] px-6 py-3 bg-[#308d46] text-white font-semibold rounded-lg shadow-md hover:bg-[#267038] transition-all duration-300"
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  {quiz.quizTitle}
                </button>
              ))}
            </div>
          )}

          {/* Quiz Questions */}
          {selectedQuiz && (
            <div className="w-full mt-6 flex flex-col items-center text-[#308d46]">
              <Quiz
                quiz={{
                  quizTitle: selectedQuiz.quizTitle,
                  questions: selectedQuiz.questions.map((q) => ({
                    question: q.question,
                    questionType: "text",
                    answers: q.answers,
                    correctAnswer: q.correctAnswer,
                    className: "filter-dropdown-select"
                  })),
                }}
                showInstantFeedback={true}
              />

            </div>
          )}

        </div>
        <div className="flex mt-4">
        <Link to='/dashboard/learning'>
          <button
            type="text"
            className="w-[100px] bg-richblack-400 text-white py-3 rounded-md hover:bg-green-700 transition-all disabled:bg-green-400"
          >
            Cancel
          </button>
        </Link>
      </div>
      </div>
    
    </>
  );
};

export default TotalQuiz;
