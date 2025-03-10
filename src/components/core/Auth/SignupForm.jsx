import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import Tab from "../../common/Tab";

function SignupForm({ setLogged }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.USER);
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const signupData = {
            ...data,
            accountType,
        };

        dispatch(setSignupData(signupData));
        dispatch(sendOtp(data.email, navigate));

        reset(); // Reset form after submission
        setAccountType(ACCOUNT_TYPE.USER);
    };

    const tabData = [
        { id: 1, tabName: "User", type: ACCOUNT_TYPE.USER },
        { id: 2, tabName: "Admin", type: ACCOUNT_TYPE.ADMIN },
    ];

    return (
        <div>
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
                <div className="flex gap-2">
                    <label>
                        <span className="text-[13px] text-richblack-50">First Name <sup className="text-[#ff3333]">*</sup></span>
                        <input
                            type="text"
                            className="border border-richblack-600 m-1 p-2 rounded-lg bg-richblack-700 text-white outline-none w-[100%]"
                            {...register("firstName", { required: "First name is required" })}
                            placeholder="Enter your first name"
                        />
                        {errors.firstName && <p className="text-[#ff3333] text-sm">{errors.firstName.message}</p>}
                    </label>

                    <label>
                        <span className="text-[13px] text-richblack-50">Last Name <sup className="text-[#ff3333]">*</sup></span>
                        <input
                            type="text"
                            className="border m-1 p-2 rounded-lg bg-richblack-700 text-white outline-none border-richblack-600 w-[100%]"
                            {...register("lastName", { required: "Last name is required" })}
                            placeholder="Enter your last name"
                        />
                        {errors.lastName && <p className="text-[#ff3333] text-sm">{errors.lastName.message}</p>}
                    </label>
                </div>

                <label className="flex flex-col">
                    <span className="text-[13px] text-richblack-50">Email<sup className="text-[#ff3333]">*</sup></span>
                    <input
                        type="email"
                        className="border m-1 p-2 rounded-lg bg-richblack-700 text-white outline-none border-richblack-600 w-[100%]"
                        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email format" } })}
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-[#ff3333] text-sm">{errors.email.message}</p>}
                </label>

                <div className="flex gap-2">
                    <label className="relative">
                        <span className="text-[13px] text-richblack-50">Create Password <sup className="text-[#ff3333]">*</sup></span>
                        <input
                            className="border m-1 p-2 rounded-lg bg-richblack-700 text-white outline-none border-richblack-600 w-[100%] pr-7"
                            type={showPass ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                            })}
                            placeholder="Enter Password"
                        />
                        <span className="absolute top-10 right-0 text-[22px] cursor-pointer" onClick={() => setShowPass(!showPass)}>
                            {showPass ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </span>
                        {errors.password && <p className="text-[#ff3333] text-sm">{errors.password.message}</p>}
                    </label>

                    <label className="relative">
                        <span className="text-[13px] text-richblack-50">Confirm Password <sup className="text-[#ff3333]">*</sup></span>
                        <input
                            className="border m-1 p-2 rounded-lg bg-richblack-700 text-white outline-none border-richblack-600 w-[100%] pr-7"
                            type={showPass2 ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Confirm password is required",
                                validate: (value) => value === password || "Passwords do not match",
                            })}
                            placeholder="Enter Confirm Password"
                        />
                        <span className="absolute top-10 right-0 text-[22px] cursor-pointer" onClick={() => setShowPass2(!showPass2)}>
                            {showPass2 ? <AiOutlineEye  /> : <AiOutlineEyeInvisible />}
                        </span>
                        {errors.confirmPassword && <p className="text-[#ff3333] text-sm">{errors.confirmPassword.message}</p>}
                    </label>
                </div>

                <div className="flex justify-center items-center mt-1">
                    <button className="mt-2 w-[100%] font-bold mx-1 rounded-lg p-2 bg-[#308d46] text-white">Create Account</button>
                </div>

                <div className="text-center mt-2 text-richblack-50">
                    Have an account? <span className="font-bold text-[#308d46]"><Link to="/login">Log In</Link></span>
                </div>
            </form>
        </div>
    );
}

export default SignupForm;
