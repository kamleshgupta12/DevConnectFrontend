import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const CreateQuiz = ({ onQuizSubmit }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const id = user?._id
  const addQuestion = () => {
    if (!newQuestion.trim() || correctAnswer === null) return;
    setQuestions([
      ...questions,
      { question: newQuestion, answers: [...answers], correctAnswer: (correctAnswer + 1).toString() },
    ]);
    setNewQuestion("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer(null);
  };

  const submitQuiz = async () => {
    if (!quizTitle.trim() || questions.length === 0) return;
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/quiz/create-quiz`, { quizTitle, questions , userId:id });
      console.log(" Quiz saved:", response.data);

      setQuizTitle("");
      setQuestions([]);


      Swal.fire({
        title: "Quiz Submitted!",
        text: `Your quiz "${quizTitle}" has been saved successfully.`,
        icon: "success",
        confirmButtonColor: "#308d46",
        confirmButtonText: "OK",
      });


      if (typeof onQuizSubmit === "function") {
        onQuizSubmit(response.data);
      }

    } catch (error) {
      console.error(" Error saving quiz:", error);


      Swal.fire({
        title: "Error!",
        text: "Something went wrong while saving the quiz.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <>
      <nav className="text-md font-medium text-richblack-300 mb-1">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="hover:text-[#308d46]">Home</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/quiz" className="hover:text-[#308d46]">Quiz System</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/post" className="text-[#308d46] font-medium">Create Quiz</Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-3xl font-medium text-center text-richblack-5 mb-6">Create a Quiz</h1>

      <div className="flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-lg border-[1px] border-richblack-700 bg-richblack-800 p-8">
          <input
            type="text"
            className="w-full p-3 border border-richblack-700 bg-richblack-900 text-white rounded-md mb-4"
            placeholder="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />

          {/* Question Input */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-3 border border-richblack-700 bg-richblack-900 text-white rounded-md"
              placeholder="Enter Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />

            {/* Answer Inputs */}
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center mt-3">
                <input
                  type="text"
                  className="w-full p-2 border border-richblack-700 bg-richblack-900 text-white rounded-md"
                  placeholder={`Answer ${index + 1}`}
                  value={answer}
                  onChange={(e) => {
                    const updatedAnswers = [...answers];
                    updatedAnswers[index] = e.target.value;
                    setAnswers(updatedAnswers);
                  }}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  className="ml-3 w-5 h-5 text-[#308d46]"
                  checked={correctAnswer === index}
                  onChange={() => setCorrectAnswer(index)}
                />
              </div>
            ))}

            <button
              className="mt-4 px-4 py-2 text-white bg-[#308d46] hover:bg-[#267038] rounded-md"
              onClick={addQuestion}
            >
              Add Question
            </button>
          </div>

          {/* Submit Button */}
          <button
            className="w-full px-4 py-3 text-white bg-richblack-700 hover:bg-[#308d46] rounded-md"
            onClick={submitQuiz}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateQuiz;
