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
    setErrorMessage(""); // Reset error message when a selection is made
  };

  const handleSubmit = () => {
    const isFormValid = Object.values(selectedOptions).every((options) => options.length > 0);

    if (isFormValid) {
      console.log("Form submitted successfully!");
    } else {
      setErrorMessage("It looks like you missed a few questions. Please answer all of them to continue.");
    }
  };

  return (
    <div className="relative text-white h-full w-full bg-gradient-to-b from-[#4F1ABE] to-[#A78DDF] to-[#FFFFFF]  flex flex-col items-center px-4 md:px-6 py-8">
      <img src="/assets/Group 750.png" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="relative w-full max-w-md mt-24 p-8 rounded-lg z-10">
        <h2 className="text-3xl font-bold mb-12 text-white text-center md:text-left">ORG logo ORG name</h2>
        <p className="text-white mb-24 text-center md:text-left">Please give us some info about your event!</p>
      </div>

      <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
        <h1 className="font-bold text-2xl mb-4 text-center md:text-left">Post Opportunity through</h1>
        <CheckboxGroup
          options={["Opportunity’s URL", "Typing in the info about the opportunity"]}
          category="opportunityType"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
      <h1 className="font-bold text-2xl mb-4 text-center md:text-left">What type of activity are you posting?</h1>
        <CheckboxGroup
          options={["Event", "Trainings", "Volunteering", "Internships"]}
          category="opportunityType"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
      <h1 className="font-bold text-2xl mb-4 text-center md:text-left">Location</h1>
        <CheckboxGroup
          options={["Prishtina", "Gjilan", "Prizren"]}
          category="location"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
      <h1 className="font-bold text-2xl mb-4 text-center md:text-left">Special Features</h1>
        <CheckboxGroup
          options={["Remote", "In office", "Hybrid"]}
          category="specialFeatures"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
      <h1 className="font-bold text-2xl mb-4 text-center md:text-left">Duration</h1>
        <CheckboxGroup
          options={["3 months", "4 months", "6 months"]}
          category="duration"
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>

      {/* Description Box */}
      <div className="relative text-black font-bold flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
      <h1>Description of the activity</h1>
       <textarea
          placeholder=""
          className="px-6 py-4 mt-6 font-light border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows="5" 
          cols="50"
  />
      </div>

      <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24  w-full max-w-md md:w-3/4 h-auto mb-12 z-10 md:items-start">
        <button
          onClick={handleSubmit}
          className="px-12 py-4 bg-[#4F1ABE] text-white rounded-2xl w-full md:w-auto"
        >
          Post
        </button>
        {errorMessage && (
          <p className="text-red-500 mt-2 text-center md:text-left">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Posting;
