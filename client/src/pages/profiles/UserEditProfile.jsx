import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/Footer';

const UserEditProfile = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('Username');

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
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
                    phone: response.data.phone || '',
                };

                setUsername(response.data.username);
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

    const formInputs = t('profile.participant.form', {
        returnObjects: true,
    });

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4F1ABE',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen w-full bg-custom-gradient-2 flex flex-col items-center py-20 relative">
                <img
                    src="/assets/bg-design.png"
                    alt=""
                    className="absolute bottom-0 left-0 z-10 opacity-50"
                />

                {/* Profile Header */}
                <div className="flex flex-col items-center md:flex-row md:justify-between w-full max-w-2xl md:max-w-4xl lg:max-w-5xl p-4 mb-16 md:mb-32 z-20">
                    <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-4">
                        <img
                            src="/assets/icon2.png"
                            alt="User Icon"
                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full -mb-2 md:mr-10"
                        />
                        <div className="text-center md:text-left">
                            <p className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 md:mb-4">
                                {username || 'Username'}
                            </p>
                            <nav className="hidden sm:flex space-x-5 text-white font-bold text-lg">
                                <Link
                                    to="/profile/edit"
                                    className="text-[#FF9202]"
                                >
                                    {t(
                                        'profile.participant.navigation.edit-profile'
                                    )}
                                </Link>
                                <Link to="/profile/myapp">
                                    {t(
                                        'profile.participant.navigation.my-applications'
                                    )}
                                </Link>
                                <Link to="/profile/saved">
                                    {t(
                                        'profile.participant.navigation.saved-for-later'
                                    )}
                                </Link>
                                <Link to="/profile/rate">
                                    {t(
                                        'profile.participant.navigation.rate-this-website'
                                    )}
                                </Link>
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
                <div className="w-full md:w-3/4 lg:w-1/2 mb-8 p-4 sm:p-6 md:p-8 rounded-lg mx-auto z-20">
                    <form className="space-y-4 bg-white w-full h-full p-8 md:p-12 lg:p-20 rounded-2xl">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-[50%] space-y-4">
                                <TextField
                                    type="text"
                                    id="name"
                                    name="name"
                                    label={formInputs.name}
                                    variant="outlined"
                                    required
                                    value={formData['name']}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <TextField
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    label={formInputs.surname}
                                    variant="outlined"
                                    required
                                    value={formData['surname']}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                            <div className="w-full md:w-[50%] space-y-4">
                                <TextField
                                    type="email"
                                    id="email"
                                    name="email"
                                    label={formInputs.email}
                                    variant="outlined"
                                    disabled
                                    value={formData['email']}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <TextField
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    label={formInputs.phone}
                                    variant="outlined"
                                    required
                                    value={formData['phone']}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>
                        <div className="mt-8 mb-20 flex flex-col items-start">
                            <button
                                onClick={handleSaveChanges}
                                className="px-12 py-4 bg-[#9F82DC] text-white rounded-2xl"
                            >
                                {t('profile.participant.save-changes')}
                            </button>
                        </div>
                    </form>
                </div>

                <Footer withBackground={false} />
            </div>
        </ThemeProvider>
    );
};

export default UserEditProfile;
