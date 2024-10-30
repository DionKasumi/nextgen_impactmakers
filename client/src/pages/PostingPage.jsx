import React, { useState } from "react";

const CheckboxGroup = ({ options, category, selectedOptions, handleCheckboxChange }) => (
  <div className="space-y-2">
    {options.map((option) => (
      <label key={option} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={selectedOptions[category].includes(option)}
          onChange={() => handleCheckboxChange(category, option)}
          className="appearance-none w-3.5 h-3.5 rounded-full border-2 border-[#ffffff] checked:bg-[#ffffff] checked:border-[#A78DDF] checked:shadow-md"
          aria-label={`Select ${option} for ${category}`}
        />
        <span>{option}</span>
      </label>
    ))}
  </div>
);

const Posting = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    opportunityType: [],
    location: [],
    specialFeatures: [],
    duration: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxChange = (category, value) => {
    setSelectedOptions((prev) => {
      const isSelected = prev[category].includes(value);
      const updatedOptions = isSelected
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
        
      return { ...prev, [category]: updatedOptions };
    });
    setErrorMessage(""); // 
  };

  const handleSubmit = () => {
    const isFormValid = Object.values(selectedOptions).every((options) => options.length > 0);

    if (isFormValid) {
      console.log("Form submitted successfully!");
    } else {
      // Set error message to prompt the user
      setErrorMessage("It looks like you missed a few questions. Please answer all of them to continue.");
    }
  };

  return (
    <div className="relative text-white h-full w-full bg-gradient-to-b from-[#4F1ABE] to-[#A78DDF] to-[#ffffff] flex flex-col items-center px-6 py-8">
      <img src="assets/Group 750.png" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-50" />

      <div className="relative w-full max-w-md mt-24 p-8 rounded-lg z-10">
        <h2 className="text-3xl font-bold mb-12 text-white">ORG logo ORG name</h2>
        <p className="text-white mb-24">Please give us some info about your event!</p>
      </div>

      <div className="relative flex flex-col w-3/4 h-auto mb-12 z-10">
        <h1 className="font-bold text-2xl mb-4">Post Opportunity through</h1>
        <CheckboxGroup
          options={["Opportunity’s URL", "Typing in the info about the opportunity"]}
          category="opportunityType"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col w-3/4 h-auto mb-12 z-10">
        <h1 className="font-bold text-2xl mb-4">What type of activity are you posting?</h1>
        <CheckboxGroup
          options={["Event", "Trainings", "Volunteering", "Internships"]}
          category="opportunityType"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col w-3/4 h-auto mb-12 z-10">
        <h1 className="font-bold text-2xl mb-4">Location</h1>
        <CheckboxGroup
          options={["Prishtina", "Gjilan", "Prizren"]}
          category="location"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col w-3/4 h-auto mb-12 z-10">
        <h1 className="font-bold text-2xl mb-4">Special Features</h1>
        <CheckboxGroup
          options={["Remote", "In office", "Hybrid"]}
          category="specialFeatures"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col w-3/4 h-auto mb-12 z-10">
        <h1 className="font-bold text-2xl mb-4">Duration</h1>
        <CheckboxGroup
          options={["3 months", "4 months", "6 months"]}
          category="duration"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      {/* Description Box */}
      <div className="relative w-3/4 text-black flex flex-col font-extrabold items-start z-10">
        <h1>Description of the activity</h1>
        <input
          type="text"
          placeholder=""
          className="px-72 py-24 mt-6 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div className="relative w-3/4 mt-8 items-start z-10">
        <button
          onClick={handleSubmit}
          className="px-12 py-4 bg-[#4F1ABE] text-white rounded-2xl"
        >
          Post
        </button>
        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 mt-2 ">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Posting;
