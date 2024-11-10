import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

const UserProfileORG = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        PersonalInfo: '',
        Name: '',
        SocialMedia: '',
        Address: '',
        PhoneNumber: '',
    });

    const [error, setError] = useState(''); // State for error message

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Check if all fields are filled
    const isFormValid = Object.values(formData).every(
        (field) => field.trim() !== ''
    );

    const handlePostOpportunityClick = () => {
        if (isFormValid) {
            navigate('/profile/org/post');
        } else {
            setError(
                'Oops! Looks like we’re missing some info. Let’s complete all fields to unlock the next step!'
            );
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#4F1ABE] to-[#FFFFFF] flex flex-col items-center px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start items-center w-full max-w-6xl mx-auto">
                {/* Image */}
                <div className="relative top-10 lg:top-44 lg:mr-10 lg:justify-center">
                    <img
                        src="../assets/userprofile.png"
                        alt="User Profile Icon"
                        className="w-32 h-32 md:w-44 md:h-44"
                    />
                </div>
            </div>
            {/* Form Section */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-8 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 p-4 sm:p-6 md:p-8 rounded-lg mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    ORG
                </h2>
                <form className="space-y-4">
                    {Object.keys(formData).map((key) => (
                        <input
                            key={key}
                            type="text"
                            name={key}
                            placeholder={key.replace(/([A-Z])/g, ' $1').trim()} // Converts camelCase to readable format
                            value={formData[key]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    ))}
                </form>
            </div>

            {/* Card Section */}
            <div className="w-full h-full mt-10 mb-12 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl justify-items-center">
                    {Array(2)
                        .fill(null)
                        .map((_, index) => (
                            <Card
                                key={index}
                                id={0}
                                card_title={''}
                                card_img={''}
                                card_duration={''}
                                card_description={''}
                                card_price={''}
                                card_source={''}
                                card_type="events"
                            />
                        ))}
                </div>
            </div>

            {/* Button */}
            <div className="mt-8 mb-20 flex flex-col items-center">
                <button
                    onClick={handlePostOpportunityClick}
                    className="px-12 py-4 bg-[#4F1ABE] text-white rounded-2xl"
                >
                    Post an opportunity
                </button>
                {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
            </div>
        </div>
    );
};

export default UserProfileORG;
