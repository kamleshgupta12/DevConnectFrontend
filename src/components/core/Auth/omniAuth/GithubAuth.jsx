import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { githubAuth } from "../../../../slices/onmiAuthSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { setUser } from "../../../../slices/profileSlice";
import { setToken } from "../../../../slices/authSlice";

const CLIENT_ID = "Ov23ligfc6pF1NY0FC8f";

const GithubAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const paramsUrl = new URLSearchParams(location.search);
  const code = paramsUrl.get("code");

  console.log("Current URL:", window.location.href);
  console.log("Extracted Code:", code);

  const getAccessToken = async (code) => {
    Swal.fire({
      title: "Loading...",
      text: "Fetching your GitHub data, please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/auth/getAccessToken?code=${code}`
      );

      if (data.access_token) {
        const userDataResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/auth/getUserData`,
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          }
        );

        Swal.close();
        if (userDataResponse.data?.success) {
          toast.success(userDataResponse.data.message);
          dispatch(setUser(userDataResponse.data.data))
          dispatch(setToken(userDataResponse.data.token))
          dispatch(githubAuth(userDataResponse.data));

          localStorage.setItem("token", JSON.stringify(userDataResponse.data.token));
          localStorage.setItem("user", JSON.stringify(userDataResponse.data.data));
          navigate("/dashboard/my-profile");
        } else {
          toast.error(userDataResponse.data?.message || "Login failed.");
        }
      }
    } catch (error) {
      console.error("GitHub Auth Error:", error);
      Swal.close();
      toast.error("Authentication failed. Please try again.");
    }
  };

  useEffect(() => {
    if (code) {
      getAccessToken(code);
    }
  }, [code]);

  
  const handleClick = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_GITHUB_URL)}&scope=user`;
    window.location.assign(authUrl);
  };

  return (
    <button
      className="flex items-center justify-center gap-2 w-[290px] p-3 border border-gray-300 rounded-lg shadow-md bg-white hover:bg-gray-100 transition-all duration-200"
      onClick={handleClick} 
    >
      <FaGithub className="text-xl text-black" />
      <span className="text-sm font-medium text-gray-800">
        Sign-in with GitHub
      </span>
    </button>
  );
};
export default GithubAuth;
