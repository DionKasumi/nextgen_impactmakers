import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserEditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        birthPlace: '',
        city: '',
        birthday: '',
        academicLevel: '',
        skills: '',
        socialMedia: '',
        jobExperience: '',
        username: '',
        phone: '',
        preferences: '',
    });
    const [initialData, setInitialData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user data when the component mounts to pre-fill the form
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/user/profile',
                    {
                        withCredentials: true,
                    }
                );

                const data = {
                    name: response.data.name || '',
                    surname: response.data.surname || '',
                    email: response.data.email || '', // Read-only field
                    birthPlace: response.data.birthPlace || '',
                    city: response.data.city || '',
                    birthday: response.data.birthday || '',
                    academicLevel: response.data.academicLevel || '',
                    skills: response.data.skills || '',
                    socialMedia: response.data.socialMedia || '',
                    jobExperience: response.data.jobExperience || '',
                    username: response.data.username || '',
                    phone: response.data.phone || '',
                    preferences: response.data.preferences
                        ? response.data.preferences.join(', ')
                        : '',
                };

                setFormData(data);
                setInitialData(data); // Store the initial data for comparison
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const handleSaveChanges = async () => {
        // Check if there's a change in data
        if (!isDataChanged()) {
            setErrorMessage('No changes detected.');
            return;
        }

        // Send updated data to the server
        try {
            const response = await axios.put(
                'http://localhost:8080/api/user/update',
                formData,
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully.');
                setErrorMessage('');
                setInitialData(formData); // Update initial data with new saved data
            } else {
                setErrorMessage('Failed to update profile.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while updating the profile.');
            console.error('Update error:', error);
        }
    };

    // Function to check if form data has changed
    const isDataChanged = () => {
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#4F1ABE] via-[#A78DDF] flex flex-col items-center py-20 relative">
            <img
                src="/assets/Frame 1.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-100"
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
                        <p className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 md:mb-4">
                            {formData.username || 'Username'}
                        </p>
                        <nav className="hidden sm:flex space-x-10 text-white font-bold text-lg">
                            <Link to="/profile/edit" className="text-[#FF9202]">
                                Edit Profile
                            </Link>
                            <Link to="/profile/myapp">My applications</Link>
                            <Link to="/profile/saved">Saved for Later</Link>
                            <Link to="/profile/rate">Rate this Website</Link>
                        </nav>
                    </div>
                </div>
                <div className="flex space-x-2 w-24 h-auto md:mt-20">
                    <button className="text-white text-3xl p-2 ">
                        &#x1F56D;
                    </button>
                    <button className="text-white text-3xl p-2 ">
                        &#9881;
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-4 md:px-0 rounded-lg mb-16 md:mb-44 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 lg:p-8 rounded-lg">
                    {/* Left Column */}
                    <div className="space-y-4 sm:space-y-6 px-4 md:px-6">
                        {[
                            'Name',
                            'Surname',
                            'Email',
                            'Birth Place',
                            'City',
                            'Academic Level',
                            'Phone',
                        ].map((label) => (
                            <div key={label}>
                                <label className="block text-white mb-1 sm:mb-2 text-lg sm:text-xl">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    name={label
                                        .toLowerCase()
                                        .replace(/\s+/g, '')}
                                    className="w-full p-3 border rounded-2xl"
                                    placeholder="Lorem Ipsum"
                                    value={
                                        formData[
                                            label
                                                .toLowerCase()
                                                .replace(/\s+/g, '')
                                        ]
                                    }
                                    onChange={handleChange}
                                    readOnly={label === 'Email'} // Make email field read-only
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 sm:space-y-6 px-4 md:px-6">
                        {[
                            'Skills',
                            'Social Media',
                            'Job Experience',
                            'Preferences',
                        ].map((label) => (
                            <div key={label}>
                                <label className="block text-white mb-1 sm:mb-2 text-lg sm:text-xl">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    name={label
                                        .toLowerCase()
                                        .replace(/\s+/g, '')}
                                    className="w-full p-3 border rounded-2xl"
                                    placeholder="Lorem Ipsum"
                                    value={
                                        formData[
                                            label
                                                .toLowerCase()
                                                .replace(/\s+/g, '')
                                        ]
                                    }
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                        <div className="flex justify-center mt-6">
                            <button
                                className="bg-[#50BACF] text-white px-8 sm:px-10 md:px-12 py-3 rounded-xl"
                                onClick={handleSaveChanges}
                                disabled={!isDataChanged()} // Disable button if no changes
                            >
                                Save changes
                            </button>
                        </div>
                        {/* Error and Success Messages */}
                        {errorMessage && (
                            <div className="text-red-500 text-center mt-4">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="text-green-500 text-center mt-4">
                                {successMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEditProfile;
