import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SwiperCarousel from '../components/SwiperCarousel';

const UserProfileORG = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    personalInfo: '',
    name: '',
    socialMedia: '',
    address: '',
    phoneNumber: '',
    description: ''
  });

  const [error, setError] = useState(''); // State for error message
  const [charCountError, setCharCountError] = useState(''); // State for character limit error

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit description to 100 characters
    if (name === "description" && value.length > 100) {
      setCharCountError("Description cannot exceed 100 characters.");
      return;
    } else {
      setCharCountError(""); // Clear error if within limit
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Check if all fields are filled
  const isFormValid = Object.values(formData).every((field) => field.trim() !== '');

  const handlePostOpportunityClick = () => {
    if (isFormValid) {
      navigate('/postingpage');
    } else {
      setError('Oops! Looks like we’re missing some info. Let’s complete all fields to unlock the next step!');
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#4F1ABE] to-[#FFFFFF] flex flex-col -mt-12 items-center px-6 py-8">
      {/* Image Section */}
      <div className="absolute top-36 left-40">
        <img src="../assets/userprofile.png" alt="User Profile Icon" className="w-44 h-44" />
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md mt-44 p-8 mr-96 -ml-44 rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-6">ORG</h2>
        <form className="space-y-4">
          <input
            type="text"
            name="personalInfo"
            placeholder="Personal Information"
            value={formData.personalInfo}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="socialMedia"
            placeholder="Social Media"
            value={formData.socialMedia}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </form>
      </div>

      <div className="w-full h-full mt-44 mb-12">
        {/* Carousel */}
        <SwiperCarousel />
      </div>

      {/* Button */}
      <div className="mt-8 mb-20 flex flex-col items-center">
        <button 
          onClick={handlePostOpportunityClick}
          className="px-12 py-4 bg-[#4F1ABE] text-white rounded-2xl"
        >
          Post an opportunity
        </button>
        {error && (
          <p className="mt-2 text-red-600 text-sm">
            {error}
          </p>
        )}
      </div>

      {/* Company Description Section */}
      <div className="max-w-lg mt-8 text-center text-black mb-24">
        <h3 className="text-xl font-bold mb-4">Company Description</h3>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-96 h-44 p-3 text-center border-transparent rounded-lg text-gray-600 bg-transparent resize-none"
          placeholder="A brief overview of your organization, including when it was founded, the core mission, and the values that guide your work. Also, information on the types of events, initiatives, or programs that your organization regularly hosts or participates in."
        />
        {charCountError && (
          <p className="mt-2 text-red-600 text-sm">
            {charCountError}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfileORG;
