import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleSignin } from "../../../../slices/onmiAuthSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../../../../slices/profileSlice";
import { setToken } from "../../../../slices/authSlice";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;

    if (!token) {
      toast.error("No token received");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/google`,
        { token }
      );

      if (data.success) {
        dispatch(googleSignin({ token: data.token }));
        dispatch(setToken(data.token))
        dispatch(setUser(data.user))

        localStorage.setItem("token", JSON.stringify(data.token))
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/dashboard/post");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Sign-in failed");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Sign-in failed."
        : "Sign-in failed. Please try again later.";

      toast.error(errorMessage);
      console.error("Google Auth Error:", error);
    }
  };

  const onError = () => {
    toast.error("Google Sign-In Failed");
    console.error("Sign-in Failed");
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        size="large"
        width="320px"
        logo_alignment="center"
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
}; 
export default GoogleAuth;
