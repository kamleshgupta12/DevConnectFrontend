import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="banner h-[90vh] bg-gray-800 text-white flex flex-col justify-center  items-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center flex flex-col justify-center  items-center gap-2 ">
                <h1 className="text-5xl font-bold text-white bg-black p-5 bg-opacity-40">Welcome to DevConnect</h1>
                <span className=" text-xl text-gray-300 flex flex-col justify-center font-bold bg-black p-5 bg-opacity-60 items-center">
                    My Developer Social Network Platform.
                </span>

                <div className="mt-10">
                    <Link to='/dashboard/my-profile'><button className="bg-[#308d46] text-white py-3 font-bold px-6 rounded-md hover:scale-140 transition duration-200 ">
                        Get Started
                    </button></Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
