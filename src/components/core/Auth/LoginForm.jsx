import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../../../services/operations/authAPI";

function LoginForm({ setLogged }) {
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        dispatch(login(data.email, data.password, navigate));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* Email Field */}
            <label className="flex flex-col mb-2">
                <span className="text-[13px] text-richblack-50">Email Address <sup className="text-[#ff3333]">*</sup></span>
                <input
                    className="border m-1 p-2 text-white rounded-lg border-b-[2px] outline-none  bg-richblack-700  border-richblack-600"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/, message: "Invalid email format" },
                    })}
                    placeholder="Enter email address"
                />
                {errors.email && <p className="text-[#ff3333] text-sm">{errors.email.message}</p>}
            </label>

            {/* Password Field */}
            <label className="flex flex-col relative">
                <span className="text-[13px]  text-richblack-50">Enter Password <sup className="text-[#ff3333]">*</sup></span>
                <input
                    className="border m-1 p-2 text-white rounded-lg border-b-[2px] outline-none  bg-richblack-700  border-richblack-600 pr-10"
                    type={showPass ? "text" : "password"}
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    placeholder="Enter password"
                />
                <span
                    className="absolute top-10 right-3 text-[22px] cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                >
                    {showPass ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
                {errors.password && <p className="text-[#ff3333] text-sm">{errors.password.message}</p>}
                <Link to="/forgot-password" className="text-right text-richblack-50 text-sm mt-1">
                    Forgot Password?
                </Link>
            </label>

            {/* Submit Button */}
            <div className="flex justify-center items-center mt-4">
                <button className="w-full font-bold rounded-lg p-2 bg-[#308d46] text-white">
                    Sign in
                </button>
            </div>

            {/* Signup Link */}
            <div className="text-center text-richblack-50 mt-2">
                Don’t have an account yet{" "}
                <Link to="/signup" className="font-bold text-[#308d46]">
                    Sign up
                </Link>
            </div>
        </form>
    );
}

export default LoginForm;
