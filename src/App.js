import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from '../src/pages/ForgotPassword'
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from './pages/Error'
import Settings from './components/core/Dashboard/Settings/index'
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { lazy, Suspense, useEffect, useState } from "react";
import Postform from "./pages/Postform";
import Home from "./pages/Home";
import AllUsers from './components/Admin/AllUsers.jsx'
import UserProfile from "./components/Admin/UserProfile.jsx";
import Profile from "./components/Admin/Profile.jsx";
import PostComponent from "./pages/Post/PostComponent.jsx";
import Tutorial from "./pages/Post/Tutorial.jsx";
import Code from "./pages/Post/Code.jsx";
import QuizMaker from "./pages/Quiz/QuizMaker.jsx";
import OpenRoute from './components/core/Auth/OpenRoute.jsx'
import CreateQuiz from "./pages/Quiz/CreateQuiz.jsx";
import Feeds from "./pages/Feeds/Feeds.jsx";
import Posts from './pages/Feeds/Posts.jsx'
import Quiz from './pages/Feeds/TotalQuiz.jsx'
import NotificationRecieve from "./pages/Notification.jsx";
import NotificationList from "./pages/Notification.jsx";
import io from "socket.io-client";
import { addNotification } from "./slices/notificationSlice.js";
import LiveChat from "./components/core/Dashboard/LiveChat.jsx";

const socket = io("http://localhost:4000");

const Navbar = lazy(() => import('./components/common/Navbar'))


function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    if (user) {
      socket.emit("registerUser", user._id);
    }

    socket.on("notification", async (notification) => {
      dispatch(addNotification(notification));


      // Save notification in DB
      try {
        await fetch(`${process.env.REACT_APP_BASE_URL}/alert/notifications/${user._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification),
        });
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [user, dispatch]);


  return (
    <div className="w-100 min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Suspense fallback={<div className="w-full h-[100vh] flex justify-center items-center "><div className="loader "></div></div>}>
        <Navbar />
        <Routes>

          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />



          <Route element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } >

            <Route path="/dashboard/my-profile" element={<MyProfile />} />
            <Route path="/dashboard/settings" element={<Settings />} />

            {
              user?.accountType === ACCOUNT_TYPE.USER && (
                <>
                  {/* <Route path="/dashboard/post" element={<AddCourse />} /> */}
                  <Route path="/dashboard/post" element={<PostComponent />} />
                  <Route path="/dashboard/media" element={<Postform />} />
                  <Route path="/dashboard/tutorial" element={<Tutorial />} />
                  <Route path="/dashboard/code" element={<Code />} />
                  <Route path="/dashboard/notification" element={<NotificationList />} />
                  <Route path="/dashboard/quiz" element={<QuizMaker />} />
                  <Route path="/dashboard/create-quiz" element={<CreateQuiz />} />
                  <Route path="/dashboard/learning" element={<Feeds />} />
                  <Route path="/dashboard/learning/tutorials" element={<Posts />} />
                  <Route path="/dashboard/learning/quizzes" element={<Quiz />} />
                  <Route path="/dashboard/user-profile" element={<Profile />} />
                  <Route path="/dashboard/message" element={<LiveChat />} />
                </>
              )
            }
            {
              user?.accountType === ACCOUNT_TYPE.ADMIN && (
                <>
                  <Route path="/dashboard/admin" element={<AllUsers />} />
                  <Route path="/dashboard/admin/user-profile" element={<UserProfile />} />

                </>
              )
            }
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
