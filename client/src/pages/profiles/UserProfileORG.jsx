import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from '../../components/Footer';

const UserProfileORG = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        personalInfo: '',
        name: '',
        socialMedia: '',
        address: '',
        phone: '',
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
            console.log(formData);
            navigate('/profile/org/post');
        } else {
            setError(t('profile.organization.errors.1'));
        }
        console.log(formData);
    };

    const [formInputs, setFormInputs] = useState(
        t('profile.organization.forms.form-1', {
            returnObjects: true,
        })
    );

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4F1ABE',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen w-full bg-custom-gradient-2 items-center px-6 py-8">
                <div className="w-full md:w-3/4 lg:w-1/2 lg:flex-row lg:items-start items-center mt-20  mx-auto p-4 sm:p-6 md:p-8">
                    <img
                        src="../assets/userprofile.png"
                        alt="User Profile Icon"
                        className="w-32"
                    />
                </div>
                {/* Form Section */}
                <div className="w-full md:w-3/4 lg:w-1/2 mt-8 sm:mt-6 lg:mt-10 xl:mt-12 p-4 sm:p-6 md:p-8 rounded-lg mx-auto">
                    <form className="space-y-4 bg-white w-full h-full p-8 md:p-12 lg:p-20 rounded-2xl">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-[50%] space-y-4">
                                <TextField
                                    type="text"
                                    id="personalInfo"
                                    name="personalInfo"
                                    label={formInputs.personalInfo}
                                    variant="outlined"
                                    required
                                    value={formData['personalInfo']}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <TextField
                                    type="text"
                                    id="name"
                                    name="name"
                                    label={formInputs.name}
                                    variant="outlined"
                                    required
                                    value={formData['name']}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <TextField
                                    type="text"
                                    id="socialMedia"
                                    name="socialMedia"
                                    label={formInputs.socialMedia}
                                    variant="outlined"
                                    required
                                    value={formData['socialMedia']}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                            <div className="w-full md:w-[50%] space-y-4">
                                <TextField
                                    type="text"
                                    id="address"
                                    name="address"
                                    label={formInputs.address}
                                    variant="outlined"
                                    required
                                    value={formData['address']}
                                    onChange={(e) => handleInputChange(e)}
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
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>
                        <div className="mt-8 mb-20 flex flex-col items-start">
                            <button
                                onClick={handlePostOpportunityClick}
                                className="px-12 py-4 bg-[#9F82DC] text-white rounded-2xl"
                            >
                                Post an opportunity
                            </button>
                            {error && (
                                <p className="mt-2 text-red-600 text-sm">
                                    {error}
                                </p>
                            )}
                        </div>
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

                <Footer withBackground={false} />
            </div>
        </ThemeProvider>
    );
};

export default UserProfileORG;
