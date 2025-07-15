import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { detectUserEnvironment } from "../utils/detectionUtils";
// import { detectUserEnvironment } from "../utils/detectionUtils"; 

const Home = () => {
    const navigate = useNavigate();

    const handleGetStarted = async (e) => {
        e.preventDefault();
        
        try {
            // Collect all user environment data
            const userData = await detectUserEnvironment();
            
            // Send data to your Node.js API
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/user-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Data successfully saved, navigate to dashboard
                navigate('/dashboard/my-profile');
            } else {
                console.error('Failed to save user data');
                // Still navigate even if data collection fails
                navigate('/dashboard/my-profile');
            }
        } catch (error) {
            console.error('Error collecting user data:', error);
            // Navigate even if there's an error
            navigate('/dashboard/my-profile');
        }
    };

    return (
        <div className="banner h-[90vh] bg-gray-800 text-white flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center flex flex-col justify-center items-center gap-2">
                <h1 className="sm:text-6xl text-xl font-bold text-white bg-black p-5 bg-opacity-40">
                    Welcome to DevConnect
                </h1>
                <span className="sm:text-xl text-sm text-gray-300 flex flex-col justify-center font-bold bg-black p-5 bg-opacity-60 items-center">
                    My Developer Social Network Platform.
                </span>

                <div className="mt-10">
                    <button 
                        onClick={handleGetStarted}
                        className="bg-[#308d46] text-white py-3 font-bold px-6 rounded-md hover:scale-140 transition duration-200"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;