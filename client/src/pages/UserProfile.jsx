import React from "react";

const UserProfile = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#4F1ABE] via-[#A78DDF] flex flex-col items-center py-20 relative">
      <img
        src="assets/Frame 1.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />
      
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:justify-between w-full max-w-2xl md:max-w-4xl lg:max-w-5xl p-4 mb-16 md:mb-32 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <img
            src="assets/icon2.png"
            alt="User Icon"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full -mb-2 md:mr-10"
          />
          <div className="text-center md:text-left">
            <p className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 md:mb-10">Username</p>
            <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-white text-sm sm:text-lg md:text-xl mt-2 md:mt-0">
              <a href="/profile/edit">Edit Profile</a>
              <a href="#my-applications">My applications</a>
              <a href="#saved-for-later">Saved for later</a>
              <a href="#rate">Rate this website</a>
            </nav>
          </div>
        </div>
        <div className="flex space-x-2 mt-6 md:mt-0 md:ml-auto w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24">
          <button className="text-white text-2xl sm:text-3xl p-2">&#x1F56D;</button>
          <button className="text-white text-2xl sm:text-3xl p-2">&#9881;</button>
        </div>
      </div>
      {/* Group 704 Icon in the Red Circle Position */}
      <div className="relative flex justify-center items-center mb-4">
            <img
              src="assets/Group 704.png"
              alt="Group Icon"
              className="w-10 h-10 -mb-60 ml-64 md:-mb-60 md:ml-96 sm:w-12 sm:h-12 sm:-mb-60 sm:ml-96 md:w-14 md:h-14 lg:w-16 lg:h-16"
            />
          </div>
      {/* Welcome */}
      <div className="text-center mt-44 h-auto relative w-full max-w-md mb-96 px-4">
        <div className="space-y-8">
          <div className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
            Welcome, Username
            <hr className="absolute left-0 right-0 mx-auto top-12 h-1 bg-white" />
          </div>
          <div className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
            Upcoming opportunities
            <hr className="absolute left-0 right-0 mx-auto top-full h-0.5 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="relative group text-white text-lg sm:text-xl md:text-2xl font-semibold hover:text-3xl">
            Opportunity 1: Deadline
          </div>
          <div className="relative group text-white text-lg sm:text-xl md:text-xl font-semibold hover:text-2xl">
            Opportunity 2: Deadline
          </div>
          <div className="relative group text-white text-sm sm:text-lg md:text-lg font-semibold hover:text-xl">
            Opportunity 3: Deadline
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;