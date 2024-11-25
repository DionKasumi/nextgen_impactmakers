import React, { useEffect, useState } from 'react';
import {
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material/';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const CheckboxGroup = ({
    options,
    title,
    category,
    selectedOptions,
    handleCheckboxChange,
}) => (
    <FormControl>
        <FormLabel
            id={`${category}-group-label`}
            style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}
        >
            {title}
        </FormLabel>
        <RadioGroup
            aria-labelledby={`${category}-group-label`}
            name={`${category}-radio-buttons-group`}
            value={selectedOptions[category]} // Bind state
            onChange={(e) => handleCheckboxChange(category, e.target.value)}
        >
            {options.map((option) => (
                <FormControlLabel
                    key={option.value} // Add key for React
                    value={option.value}
                    control={<Radio sx={{ color: 'white' }} />}
                    label={option.label}
                />
            ))}
        </RadioGroup>
    </FormControl>
);

const Posting = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('Username');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/user/profile',
                    {
                        withCredentials: true,
                    }
                );

                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const [selectedOptions, setSelectedOptions] = useState({
        postingType: '',
        opportunityType: '',
        location: '',
        specialFeatures: '',
        duration: '',
    });
    const [description, setDescription] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const handleCheckboxChange = (category, value) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [category]: value, // Set the selected value directly
        }));
        setErrorMessage(''); // Reset error message
    };

    const handleSubmit = () => {
        const isFormValid = Object.values(selectedOptions).every(
            (option) => option !== '' // Ensure all categories have a selected value
        );

        if (isFormValid) {
            console.log('Form submitted successfully!', selectedOptions);
            console.log('Description: ' + description);
        } else {
            setErrorMessage(
                'It looks like you missed a few questions. Please answer all of them to continue.'
            );
        }
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4F1ABE',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="relative text-white h-full w-full bg-custom-gradient-2 flex flex-col items-center px-4 md:px-6 py-8">
                <img
                    src="/assets/bg-design.png"
                    alt=""
                    className="absolute bottom-0 left-0 z-10 opacity-50"
                />

                <div className="relative w-full mt-24 p-8 z-20">
                    <h2 className="text-3xl font-bold mb-8 text-white text-center">
                        {username || 'Username'}
                    </h2>
                    <p className="text-white text-2xl mb-12 text-center">
                        {t('profile.organization.text-1')}
                    </p>
                </div>

                <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <CheckboxGroup
                        options={t(
                            'profile.organization.forms.form-2.1.options',
                            {
                                returnObjects: true,
                            }
                        )}
                        title={t('profile.organization.forms.form-2.1.title')}
                        category="postingType"
                        selectedOptions={selectedOptions}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>
                <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <CheckboxGroup
                        options={t(
                            'profile.organization.forms.form-2.2.options',
                            {
                                returnObjects: true,
                            }
                        )}
                        title={t('profile.organization.forms.form-2.2.title')}
                        category="opportunityType"
                        selectedOptions={selectedOptions}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>
                <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <CheckboxGroup
                        options={t(
                            'profile.organization.forms.form-2.3.options',
                            {
                                returnObjects: true,
                            }
                        )}
                        title={t('profile.organization.forms.form-2.3.title')}
                        category="location"
                        selectedOptions={selectedOptions}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>
                <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <CheckboxGroup
                        options={t(
                            'profile.organization.forms.form-2.4.options',
                            {
                                returnObjects: true,
                            }
                        )}
                        title={t('profile.organization.forms.form-2.4.title')}
                        category="specialFeatures"
                        selectedOptions={selectedOptions}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>
                <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <CheckboxGroup
                        options={t(
                            'profile.organization.forms.form-2.5.options',
                            {
                                returnObjects: true,
                            }
                        )}
                        title={t('profile.organization.forms.form-2.5.title')}
                        category="duration"
                        selectedOptions={selectedOptions}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>

                <div className="relative text-black font-bold flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <TextField
                        id="description-box"
                        label={t('profile.organization.forms.description')}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        multiline
                        fullWidth
                        variant="filled"
                        rows={4}
                    />
                </div>

                <div className="relative flex flex-col mr-0 md:mr-48 lg:mr-96 -ml-0 md:-ml-24 w-full max-w-md md:w-3/4 h-auto mb-12 z-20 md:items-start">
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-4 bg-[#4F1ABE] text-white rounded-2xl"
                    >
                        {t('profile.organization.forms.post')}
                    </button>
                    {errorMessage && (
                        <p className="text-red-500 mt-2 text-center md:text-left">
                            {errorMessage}
                        </p>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Posting;
