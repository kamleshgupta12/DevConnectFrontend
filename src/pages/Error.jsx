import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-[#c6c4c4]">Error - 404 Not Found!</h1>
      <p className="text-lg text-[#b2b1b1]">Oops! Something went wrong....</p>
    </div>
  );
};

export default ErrorPage;
