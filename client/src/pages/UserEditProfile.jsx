import React, { useState } from "react";

const UserEditProfile = () => {

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthPlace: "",
    city: "",
    birthday: "",
    academicLevel: "",
    skills: "",
    socialMedia: "",
    jobExperience: "",
  });
  const [errorMessage, setErrorMessage] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };


  const handleSaveChanges = () => {

    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.birthPlace ||
      !formData.city ||
      !formData.birthday ||
      !formData.academicLevel ||
      !formData.skills ||
      !formData.socialMedia ||
      !formData.jobExperience
    ) {
      setErrorMessage("Your profile needs a bit more sparkle. Fill in the blanks!"); // Set error message if fields are incomplete
    } else {
      console.log("Changes saved:", formData); 
      setErrorMessage(""); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#4F1ABE] via-[#A78DDF] flex flex-col items-center py-20 relative">

    <img
      src="/assets/Frame 1.png"
      alt=""
      className="absolute inset-0 w-full h-full  object-cover opacity-100"
    />   
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:justify-between w-full max-w-2xl md:max-w-4xl lg:max-w-5xl p-4 mb-16 md:mb-32 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <img
            src="/assets/icon2.png"
            alt="User Icon"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full -mb-2 md:mr-10"
          />
          <div className="text-center md:text-left">
            <p className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 md:mb-10">Username</p>
            <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-white text-sm sm:text-lg md:text-xl mt-2 md:mt-0">
              <a href="/profile/edit" className="text-orange-700">Edit Profile</a>
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

      {/* Form Section */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-4 md:px-0 rounded-lg mb-16 md:mb-44 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 lg:p-8 rounded-lg">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6 px-4 md:px-6">
            {['Name', 'Surname', 'Email', 'Birth Place', 'City', 'Birthday', 'Academic Level'].map((label) => (
              <div key={label}>
                <label className="block text-white mb-1 sm:mb-2 text-lg sm:text-xl">{label}</label>
                <input
                  type="text"
                  name={label.toLowerCase().replace(/\s+/g, '')} // e.g., name -> name
                  className="w-full p-3 border rounded-2xl"
                  placeholder="Lorem Ipsum"
                  value={formData[label.toLowerCase().replace(/\s+/g, '')]} // Bind value to state
                  onChange={handleChange} // Update state on change
                />
              </div>
            ))}
            <div>
              <label className="block text-white mb-1 sm:mb-2 text-lg sm:text-xl">Birthday</label>
              <input
                type="date"
                name="birthday" // Specify the name for the birthday field
                className="w-full p-3 border rounded-2xl"
                value={formData.birthday} // Bind value to state
                onChange={handleChange} // Update state on change
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 px-4 md:px-6">
            {['Skills', 'Social Media', 'Job Experience'].map((label) => (
              <div key={label}>
                <label className="block text-white mb-1 sm:mb-2 text-lg sm:text-xl">{label}</label>
                <input
                  type="text"
                  name={label.toLowerCase().replace(/\s+/g, '')} // e.g., skills -> skills
                  className="w-full p-3 border rounded-2xl"
                  placeholder="Lorem Ipsum"
                  value={formData[label.toLowerCase().replace(/\s+/g, '')]} // Bind value to state
                  onChange={handleChange} // Update state on change
                />
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <button
                className="bg-[#50BACF] text-white px-8 sm:px-10 md:px-12 py-3 rounded-xl"
                onClick={handleSaveChanges} // Call save function on click
              >
                Save changes
              </button>
            </div>
            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-center mt-4">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditProfile;
