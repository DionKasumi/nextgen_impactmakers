/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    AlertTitle,
    Alert,
    TextField,
    ListItemText,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
} from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4F1ABE',
        },
    },
});

const ParticipantForm = ({
    participantData,
    handleChange,
    errors,
    changeLanguage,
}) => {
    const { t } = useTranslation();

    return (
        <ThemeProvider theme={theme}>
            <Box
                component="div"
                sx={{
                    '& > :not(style)': { width: '100%', my: '7px' },
                }}
                noValidate
                autoComplete="off"
                className="w-full"
            >
                <FormControl variant="outlined">
                    <InputLabel id="language">
                        {t('signup-page.language')}
                    </InputLabel>
                    <Select
                        labelId="language"
                        id="language"
                        value={participantData.language}
                        onChange={(e) => {
                            handleChange(e);
                            changeLanguage(e);
                        }}
                        label={t('signup-page.language')}
                        name="language"
                    >
                        <MenuItem value={'en'}>English</MenuItem>
                        <MenuItem value={'al'}>Shqip</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    type="text"
                    id="username"
                    label={t('signup-page.username')}
                    variant="outlined"
                    required
                    name="username"
                    value={participantData.username || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.username}
                    helperText={
                        errors.username ? t('signup-page.errors.username') : ''
                    }
                />
                <TextField
                    type="email"
                    id="email"
                    label={t('signup-page.email')}
                    variant="outlined"
                    required
                    name="email"
                    value={participantData.email || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.email}
                    helperText={
                        errors.email ? t('signup-page.errors.email') : ''
                    }
                />
                <TextField
                    type="text"
                    id="phone"
                    label={t('signup-page.phone')}
                    variant="outlined"
                    required
                    name="phone"
                    value={participantData.phone || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.phone}
                    helperText={
                        errors.phone ? t('signup-page.errors.phone') : ''
                    }
                />
                <TextField
                    type="password"
                    id="password"
                    label={t('signup-page.password')}
                    variant="outlined"
                    color="primary"
                    required
                    name="password"
                    value={participantData.password || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.password}
                    helperText={
                        errors.password ? t('signup-page.errors.password') : ''
                    }
                />
            </Box>
        </ThemeProvider>
    );
};

const ParticipantSecondForm = ({ preferencesData, handleChange }) => {
    const [checked, setChecked] = useState(preferencesData || []);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/labels'
                );
                let fetchedLabels = response.data.labels || [];

                // Move "Other" to the end of the array if it exists
                fetchedLabels = fetchedLabels.filter(
                    (label) => label !== 'Other'
                );
                fetchedLabels.push('Other');

                setLabels(fetchedLabels);
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        };

        fetchLabels();
    }, []);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        handleChange(newChecked);
    };

    return (
        <List className="w-full bg-[#A3A9FE45] rounded-md h-auto max-h-96 overflow-y-scroll">
            {labels.length > 0 ? (
                labels.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;
                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={handleToggle(value)} dense>
                                <ListItemText id={labelId} primary={value} />
                                <ListItemIcon>
                                    <Checkbox
                                        edge="end"
                                        checked={checked.includes(value)}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    );
                })
            ) : (
                <p>No labels available</p>
            )}
        </List>
    );
};

const OrganizationForm = ({
    orgData,
    handleChange,
    errors,
    changeLanguage,
}) => {
    const { t } = useTranslation();
    return (
        <ThemeProvider theme={theme}>
            <Box
                component="div"
                sx={{
                    '& > :not(style)': { width: '100%', my: '7px' },
                }}
                noValidate
                autoComplete="off"
                className="w-full"
            >
                <FormControl variant="outlined">
                    <InputLabel id="language">
                        {t('signup-page.language')}
                    </InputLabel>
                    <Select
                        labelId="language"
                        id="language"
                        value={orgData.language}
                        onChange={(e) => {
                            handleChange(e);
                            changeLanguage(e);
                        }}
                        label={t('signup-page.language')}
                        name="language"
                    >
                        <MenuItem value={'en'}>English</MenuItem>
                        <MenuItem value={'al'}>Shqip</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    type="text"
                    id="name_of_org"
                    label={t('signup-page.name-of-org')}
                    variant="outlined"
                    required
                    name="name_of_org"
                    value={orgData.name_of_org || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.name_of_org}
                    helperText={
                        errors.name_of_org
                            ? t('signup-page.errors.name-of-org')
                            : ''
                    }
                />
                <TextField
                    type="email"
                    id="email_of_org"
                    label={t('signup-page.email')}
                    variant="outlined"
                    required
                    name="email_of_org"
                    value={orgData.email_of_org || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.email_of_org}
                    helperText={
                        errors.email_of_org ? t('signup-page.errors.email') : ''
                    }
                />
                <TextField
                    type="text"
                    id="phone_number_of_org"
                    label={t('signup-page.phone')}
                    variant="outlined"
                    required
                    name="phone_number_of_org"
                    value={orgData.phone_number_of_org || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.phone_number_of_org}
                    helperText={
                        errors.phone_number_of_org
                            ? t('signup-page.errors.phone')
                            : ''
                    }
                />
                <TextField
                    type="password"
                    id="password_of_org"
                    label={t('signup-page.password')}
                    variant="outlined"
                    required
                    name="password_of_org"
                    value={orgData.password_of_org || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.password_of_org}
                    helperText={
                        errors.password_of_org
                            ? t('signup-page.errors.password')
                            : ''
                    }
                />
                <TextField
                    type="text"
                    id="url_of_org"
                    label={t('signup-page.url')}
                    variant="outlined"
                    required
                    name="url_of_org"
                    value={orgData.url_of_org || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.url_of_org}
                    helperText={
                        errors.url_of_org ? t('signup-page.errors.url') : ''
                    }
                />
                <TextField
                    type="text"
                    id="description_of_org"
                    label={t('signup-page.description')}
                    variant="outlined"
                    multiline
                    maxRows={2}
                    required
                    name="description_of_org"
                    value={orgData.description_of_org || ''}
                    onChange={(e) => handleChange(e)}
                    error={!!errors.description_of_org}
                    helperText={
                        errors.description_of_org
                            ? t('signup-page.errors.description')
                            : ''
                    }
                />
            </Box>
        </ThemeProvider>
    );
};

const MainForm = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const [isOrg, setOrg] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        type: 'success',
        heading: 'Success',
        message: '',
    });

    const [isParticipantSecondForm, setParticipantSecondForm] = useState(false);

    const [participantData, setParticipantData] = useState({
        language: i18n.language,
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    const [preferencesData, setPreferencesData] = useState([]);
    const [orgData, setOrgData] = useState({
        language: i18n.language,
        name_of_org: '',
        email_of_org: '',
        phone_number_of_org: '',
        password_of_org: '',
        url_of_org: '',
        description_of_org: '',
    });

    const [errors, setErrors] = useState({
        username: false,
        email: false,
        phone: false,
        password: false,
        name_of_org: false,
        email_of_org: false,
        phone_number_of_org: false,
        password_of_org: false,
        url_of_org: false,
        description_of_org: false,
    });

    const handleAlertToggle = () => {
        setAlertOpen(!alertOpen);
    };

    const handleParticipantChange = (e) => {
        setParticipantData({
            ...participantData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: false });
    };

    const handlePreferencesChange = (newChecked) => {
        setPreferencesData(newChecked);
    };

    const handleOrgChange = (e) => {
        setOrgData({
            ...orgData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: false });
    };

    const onFormTypeChange = () => {
        setOrg(!isOrg);
        setAlertOpen(false);
        setParticipantData({
            language: i18n.language,
            username: '',
            email: '',
            phone: '',
            password: '',
        });
        setOrgData({
            language: i18n.language,
            name_of_org: '',
            email_of_org: '',
            phone_number_of_org: '',
            password_of_org: '',
            url_of_org: '',
            description_of_org: '',
        });
    };

    const resetData = () => {
        setParticipantSecondForm(false);
        setPreferencesData([]);
        setParticipantData({
            language: i18n.language,
            username: '',
            email: '',
            phone: '',
            password: '',
        });
        setOrgData({
            language: i18n.language,
            name_of_org: '',
            email_of_org: '',
            phone_number_of_org: '',
            password_of_org: '',
            url_of_org: '',
            description_of_org: '',
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let hasError = false;
        const newErrors = { ...errors };

        if (isOrg) {
            if (!orgData.name_of_org) {
                newErrors.name_of_org = true;
                hasError = true;
            }
            if (!orgData.email_of_org || !validateEmail(orgData.email_of_org)) {
                newErrors.email_of_org = true;
                hasError = true;
            }
            if (!orgData.phone_number_of_org) {
                newErrors.phone_number_of_org = true;
                hasError = true;
            }
            if (!orgData.password_of_org) {
                newErrors.password_of_org = true;
                hasError = true;
            }
            if (!orgData.url_of_org) {
                newErrors.url_of_org = true;
                hasError = true;
            }
            if (!orgData.description_of_org) {
                newErrors.description_of_org = true;
                hasError = true;
            }
        } else {
            if (!participantData.username) {
                newErrors.username = true;
                hasError = true;
            }
            if (
                !participantData.email ||
                !validateEmail(participantData.email)
            ) {
                newErrors.email = true;
                hasError = true;
            }
            if (!participantData.phone) {
                newErrors.phone = true;
                hasError = true;
            }
            if (!participantData.password) {
                newErrors.password = true;
                hasError = true;
            }
        }
        setErrors(newErrors);
        return !hasError;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) return;

        try {
            if (isOrg) {
                const response = await axios.post(
                    'http://localhost:8080/signup',
                    {
                        ...orgData,
                        isOrg: true,
                    }
                );

                handleSuccessResponse(response);
            } else {
                if (isParticipantSecondForm) {
                    const response = await axios.post(
                        'http://localhost:8080/signup',
                        { ...participantData, preferences: preferencesData }
                    );

                    handleSuccessResponse(response);
                } else {
                    setParticipantSecondForm(true);
                }
            }
        } catch (error) {
            // Check for the specific banned email message
            if (error.response && error.response.status === 403) {
                alert('You cannot register with a banned email.'); // Show banned message
            } else {
                handleFailedResponse(error); // Handle other errors
            }
        }
    };

    const handleSuccessResponse = (res) => {
        setAlertMessage({
            type: 'success',
            heading: 'Success',
            message: t('signup-page.alerts.success'),
        });
        setAlertOpen(true);

        setTimeout(() => {
            navigate('/login');
        }, 1000);

        resetData();
    };

    const handleFailedResponse = (error) => {
        setAlertMessage({
            type: 'error',
            heading: 'Error',
            message:
                error.response?.data.message || t('signup-page.alerts.success'),
        });
        setAlertOpen(true);
        resetData();
    };

    const [lang, setLang] = useState(i18n.language);
    const switchLanguage = () => {
        if (lang === 'en') {
            setLang('al');
            i18n.changeLanguage('al');
        } else {
            setLang('en');
            i18n.changeLanguage('en');
        }
    };

    return (
        <>
            <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-[95%] flex justify-center items-center flex-col">
                <h2 className="text-xl md:text-2xl xl:text-3xl text-black font-bold mt-4">
                    {t('signup-page.signup')}
                </h2>
                <h2 className="text-sm md:text-base xl:text-lg text-black italic font-normal mb-1">
                    {t('signup-page.text-1')}
                </h2>
                <h3 className="font-bold mb-4 text-base md:text-lg">
                    {t('signup-page.text-2')}
                </h3>
                <div className="flex flex-row justify-center items-center w-full md:w-2/3 lg:w-1/2 mb-4">
                    <button
                        disabled={!isOrg}
                        onClick={onFormTypeChange}
                        type="button"
                        className="bg-[#C5C5C5] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-[#4F1ABE] text-sm disabled:bg-[#4F1ABE] disabled:scale-95 disabled:text-white transition-all"
                    >
                        {t('signup-page.user-type.participant')}
                    </button>
                    <p className="mx-2 text-sm md:text-base">
                        {t('signup-page.text-3')}
                    </p>
                    <button
                        disabled={isOrg}
                        onClick={onFormTypeChange}
                        type="button"
                        className="bg-[#C5C5C5] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-[#4F1ABE] text-sm disabled:bg-[#4F1ABE] disabled:scale-95 disabled:text-white transition-all"
                    >
                        {t('signup-page.user-type.organization')}
                    </button>
                </div>
                {!isOrg ? (
                    !isParticipantSecondForm ? (
                        <ParticipantForm
                            participantData={participantData}
                            handleChange={handleParticipantChange}
                            errors={errors}
                            changeLanguage={switchLanguage}
                        />
                    ) : (
                        <ParticipantSecondForm
                            preferencesData={preferencesData}
                            handleChange={handlePreferencesChange}
                        />
                    )
                ) : (
                    <OrganizationForm
                        orgData={orgData}
                        handleChange={handleOrgChange}
                        errors={errors}
                        changeLanguage={switchLanguage}
                    />
                )}
                <button
                    type="button"
                    onClick={onSubmit}
                    className="py-2 px-16 lg:px-24 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto my-4 text-sm md:text-base"
                >
                    {isOrg
                        ? t('signup-page.finish')
                        : t('signup-page.continue')}
                </button>
            </div>
            {alertOpen ? (
                <div>
                    <Alert
                        severity={alertMessage.type}
                        className="fixed z-50 right-4 bottom-4"
                    >
                        <AlertTitle className="flex justify-between overflow-hidden">
                            {alertMessage.heading}
                            <button
                                className="scale-[1.5]"
                                onClick={handleAlertToggle}
                            >
                                <IoMdClose />
                            </button>
                        </AlertTitle>
                        {alertMessage.message}
                    </Alert>
                </div>
            ) : (
                ''
            )}
        </>
    );
};

const SignupPage = () => {
    return (
        <div className="w-screen min-h-screen h-auto flex flex-col justify-center items-center bg-[#4F1ABE]">
            <form className="w-11/12 sm:w-3/5 md:w-3/5 lg:w-2/4 h-auto max-w-md flex bg-white rounded-lg flex-col justify-center items-center px-4 md:px-8 my-4">
                <MainForm />
            </form>
        </div>
    );
};

export default SignupPage;
