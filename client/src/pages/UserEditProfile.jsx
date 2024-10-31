import React from "react";

const UserEditProfile = () => {
  return (
    <div className="h-auto w-full bg-gradient-to-b from-[#4F1ABE] via-[#A78DDF] to-[#FFFFFF] flex flex-col items-center py-20 relative">
      <img src="assets/Frame 1.png" alt="" className="absolute w-auto h-auto z-0" />
      
      {/* Profile Header */}
      <div className="flex justify-between w-2/3 p-4 mb-32 z-10">
        <div className="flex items-end space-x-4">
          <img src="assets/icon2.png" alt="User Icon" className="w-44 h-44 rounded-full mr-10 -mb-4" />
          <div>
            <p className="text-white text-4xl font-semibold mb-4">Username</p>
            <nav className="flex space-x-10 text-white text-xl">
              <a href="#edit-profile" className="text-orange-700">Edit Profile</a>
              <a href="#my-applications">My applications</a>
              <a href="#saved-for-later">Saved for later</a>
              <a href="#rate">Rate this website</a>
            </nav>
          </div>
        </div>
        <div className="flex space-x-2 w-24 h-24">
          <button className="text-white text-3xl p-2">&#x1F56D;</button>
          <button className="text-white text-3xl p-2">&#9881;</button>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-1/2 rounded-lg mr-80 mb-44 z-10">
        <div className="grid grid-cols-[3fr_1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-6 mr-96">
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Name</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Surname</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Email</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Birth Place</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">City</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Birthday</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Academic Level</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 -ml-24">
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Skills</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Social Media</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div>
              <label className="block text-white ml-4 mb-2 text-xl">Job Experience</label>
              <input type="text" className="w-full p-3 border rounded-2xl" placeholder="Lorem Ipsum" />
            </div>
            <div className="flex justify-center mt-6 mr-28">
              <button className="bg-[#50BACF] text-white px-12 py-3 rounded-xl">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditProfile;
