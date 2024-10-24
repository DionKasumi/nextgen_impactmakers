/* eslint-disable react/prop-types */
import { useState } from 'react';
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
    FormGroup,
    FormControlLabel,
} from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4F1ABE',
        },
    },
});

const ParticipantForm = ({ participantData, handleChange }) => {
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
                <TextField
                    type="text"
                    id="username"
                    label="Username"
                    variant="outlined"
                    required
                    name="username"
                    value={participantData.username}
                    onChange={handleChange}
                />
                <TextField
                    type="email"
                    id="email"
                    label="Email"
                    variant="outlined"
                    required
                    name="email"
                    value={participantData.email}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="phone"
                    label="Phone"
                    variant="outlined"
                    required
                    name="phone"
                    value={participantData.phone}
                    onChange={handleChange}
                />
                <TextField
                    type="password"
                    id="password"
                    label="Password"
                    variant="outlined"
                    color="primary"
                    required
                    name="password"
                    value={participantData.password}
                    onChange={handleChange}
                />
            </Box>
        </ThemeProvider>
    );
};

const ParticipantSecondForm = ({ preferencesData, handleChange }) => {
    const [checked, setChecked] = useState(preferencesData || []);

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
        <ThemeProvider theme={theme}>
            <List className="w-full bg-[#A3A9FE45] rounded-md h-auto max-h-96 overflow-y-scroll">
                {['Programming', 'Art', 'Design', 'Music', 'Technology'].map(
                    (value, index) => {
                        const labelId = `checkbox-list-label-${index}`;
                        return (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={handleToggle(value)}
                                    dense
                                >
                                    <ListItemText
                                        id={labelId}
                                        primary={value}
                                    />
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
                    }
                )}
            </List>
        </ThemeProvider>
    );
};

const OrganizationForm = ({ orgData, handleChange }) => {
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
                <TextField
                    type="text"
                    id="name_of_org"
                    label="Name Of Organization"
                    variant="outlined"
                    required
                    name="name_of_org"
                    value={orgData.name_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="email"
                    id="email_of_org"
                    label="Email"
                    variant="outlined"
                    required
                    name="email_of_org"
                    value={orgData.email_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="phone_number_of_org"
                    label="Phone Number"
                    variant="outlined"
                    required
                    name="phone_number_of_org"
                    value={orgData.phone_number_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="password"
                    id="password_of_org"
                    label="Password"
                    variant="outlined"
                    required
                    name="password_of_org"
                    value={orgData.password_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="url_of_org"
                    label="URL"
                    variant="outlined"
                    required
                    name="url_of_org"
                    value={orgData.url_of_org}
                    onChange={handleChange}
                />
                <TextField
                    type="text"
                    id="description_of_org"
                    label="Description"
                    variant="outlined"
                    multiline
                    maxRows={2}
                    required
                    name="description_of_org"
                    value={orgData.description_of_org}
                    onChange={handleChange}
                />
            </Box>
        </ThemeProvider>
    );
};

const MainForm = () => {
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
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    const [preferencesData, setPreferencesData] = useState([]);
    const [orgData, setOrgData] = useState({
        name_of_org: '',
        email_of_org: '',
        phone_number_of_org: '',
        password_of_org: '',
        url_of_org: '',
        description_of_org: '',
    });

    const handleAlertToggle = () => {
        setAlertOpen(!alertOpen);
    };

    const handleParticipantChange = (e) => {
        setParticipantData({
            ...participantData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePreferencesChange = (newChecked) => {
        setPreferencesData(newChecked);
    };

    const handleOrgChange = (e) => {
        setOrgData({
            ...orgData,
            [e.target.name]: e.target.value,
        });
    };

    const onFormTypeChange = () => {
        setOrg(!isOrg);
        setAlertOpen(false);
        resetData();
    };

    const resetData = () => {
        setParticipantData({
            username: '',
            email: '',
            phone: '',
            password: '',
        });
        setOrgData({
            name_of_org: '',
            email_of_org: '',
            phone_number_of_org: '',
            password_of_org: '',
            url_of_org: '',
            description_of_org: '',
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isOrg) {
                const response = await axios.post(
                    'http://localhost:8080/signup',
                    {
                        ...orgData,
                        isOrg: true,
                    }
                );

                let count = 3;
                setAlertMessage({
                    type: 'success',
                    heading: 'Success',
                    message: `Signup successful. Redirecting in ${count}...`,
                });
                setAlertOpen(true);

                let t1 = setInterval(() => {
                    if (count > 0) {
                        count--;
                        setAlertMessage((prevState) => ({
                            ...prevState,
                            message: `Signup successful. Redirecting in ${count}...`,
                        }));
                    } else {
                        clearInterval(t1);
                        navigate('/');
                    }
                }, 1000);

                resetData();
            } else {
                if (isParticipantSecondForm) {
                    const response = await axios.post(
                        'http://localhost:8080/signup',
                        { ...participantData, preferences: preferencesData }
                    );

                    let count = 3;
                    setAlertMessage({
                        type: 'success',
                        heading: 'Success',
                        message: `Signup successful. Redirecting in ${count}...`,
                    });
                    setAlertOpen(true);

                    let t1 = setInterval(() => {
                        if (count > 0) {
                            count--;
                            setAlertMessage((prevState) => ({
                                ...prevState,
                                message: `Signup successful. Redirecting in ${count}...`,
                            }));
                        } else {
                            clearInterval(t1);
                            navigate('/');
                        }
                    }, 1000);

                    resetData();
                } else {
                    setParticipantSecondForm(true);
                }
            }
        } catch (error) {
            console.error(
                'Error submitting form:',
                error.response?.data || error.message
            );
            setAlertMessage({
                type: 'error',
                heading: 'Error',
                message: 'Error signing up. Please try again.',
            });
            setAlertOpen(true);
            resetData();
        }
    };

    return (
        <>
            <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-[95%] flex justify-center items-center flex-col">
                <h2 className="text-xl md:text-2xl xl:text-3xl text-black font-bold mt-4">
                    Sign Up
                </h2>
                <h2 className="text-sm md:text-base xl:text-lg text-black italic font-normal mb-1">
                    Create An Account
                </h2>
                <h3 className="font-bold mb-4 text-base md:text-lg">
                    Are you a
                </h3>
                <div className="flex flex-row justify-center items-center w-full md:w-2/3 lg:w-1/2 mb-4">
                    <button
                        disabled={!isOrg}
                        onClick={onFormTypeChange}
                        type="button"
                        className="bg-[#C5C5C5] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-[#4F1ABE] text-sm disabled:bg-[#4F1ABE] disabled:scale-95 disabled:text-white transition-all"
                    >
                        Participant
                    </button>
                    <p className="mx-2 text-sm md:text-base">or</p>
                    <button
                        disabled={isOrg}
                        onClick={onFormTypeChange}
                        type="button"
                        className="bg-[#C5C5C5] border-none rounded-md focus:outline-none py-2 px-4 md:px-6 text-[#4F1ABE] text-sm disabled:bg-[#4F1ABE] disabled:scale-95 disabled:text-white transition-all"
                    >
                        Organization
                    </button>
                </div>
                {!isOrg ? (
                    !isParticipantSecondForm ? (
                        <ParticipantForm
                            participantData={participantData}
                            handleChange={handleParticipantChange}
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
                    />
                )}
                <button
                    type="button"
                    onClick={onSubmit}
                    className="py-2 px-16 lg:px-24 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto my-4 text-sm md:text-base"
                >
                    {isOrg ? 'Finish' : 'Continue'}
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
            ) : null}
        </>
    );
};

const SignupPage = () => {
    return (
        <div className="w-screen min-h-screen h-auto flex flex-col justify-center items-center bg-[#4F1ABE]">
            <form className="w-11/12 sm:w-4/5 md:w-3/6 xl:w-2/6 h-auto flex bg-white rounded-lg flex-col justify-center items-center px-4 md:px-8">
                <MainForm />
            </form>
        </div>
    );
};

export default SignupPage;
