import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IoMdClose } from 'react-icons/io';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Ensure Axios sends session cookies with requests
axios.defaults.withCredentials = true;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isOrg, setIsOrg] = useState(false); // Toggle between participant and organization
    const navigate = useNavigate();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        type: 'success',
        heading: 'Success',
        message: '',
    });

    // Handle form submission (login request)
    const handleFormSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
                rememberMe,
                isOrg, // Send whether the user is an organization
            });

            if (response.data.success) {
                let count = 3;
                setAlertMessage({
                    type: 'success',
                    heading: 'Success',
                    message: `Login successful. Redirecting in ${count}`,
                });
                setAlertOpen(true);

                // Countdown to redirect
                let t1 = setInterval(() => {
                    if (count > 0) {
                        count--;
                        setAlertMessage({
                            type: 'success',
                            heading: 'Success',
                            message: `Login successful. Redirecting in ${count}`,
                        });
                    } else {
                        clearTimeout(t1);
                        navigate('/'); // Redirect to homepage after countdown
                    }
                }, 1000);
            } else {
                setAlertMessage({
                    type: 'error',
                    heading: 'Error',
                    message: 'Invalid credentials',
                });
                setAlertOpen(true);
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            setAlertMessage({
                type: 'error',
                heading: 'Error',
                message: 'Login failed. Please try again.',
            });
            setAlertOpen(true);
        }
    };

    // Handle closing alert
    const handleAlertToggle = () => {
        setAlertOpen(!alertOpen);
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
            <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#4F1ABE]">
                <form className="w-11/12 sm:w-3/5 md:w-3/5 lg:w-2/4 h-auto max-w-md flex flex-col bg-white rounded-lg p-6 justify-center items-center">
                    <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-full">
                        <h2 className="text-xl text-black font-bold mt-12 mb-4">
                            Log In
                        </h2>
                        <Box
                            component="div"
                            sx={{
                                '& > :not(style)': { width: '100%', my: '7px' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                type="email"
                                id="email"
                                label="Email"
                                variant="outlined"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                type="password"
                                id="password"
                                label="Password"
                                variant="outlined"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Box>
                        <div className="w-full h-auto flex justify-between items-center flex-row mb-6">
                            <div className="flex flex-row">
                                <input
                                    type="checkbox"
                                    name="remember_me"
                                    id="remember_me"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="mr-2 w-4"
                                />
                                <h1 className="font-medium">Remember Me</h1>
                            </div>

                            <Link className="font-medium">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Toggle between Participant and Organization */}
                        <div className="w-full flex justify-between mb-4">
                            <button
                                type="button"
                                className={`py-2 px-3 sm:px-6 md:px-8 rounded-md focus:outline-none transition-all duration-300 ${!isOrg ? 'bg-[#4F1ABE] text-white' : 'bg-[#E0E0E0] text-[#4F1ABE] hover:bg-[#C5C5C5]'}`}
                                onClick={() => setIsOrg(false)}
                            >
                                Participant
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-3 sm:px-6 md:px-8 rounded-md focus:outline-none transition-all duration-300 ${isOrg ? 'bg-[#4F1ABE] text-white' : 'bg-[#E0E0E0] text-[#4F1ABE] hover:bg-[#C5C5C5]'}`}
                                onClick={() => setIsOrg(true)}
                            >
                                Organization
                            </button>
                        </div>

                        <button
                            type="button"
                            className="py-2 px-24 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto mb-4 text-sm md:text-base hover:bg-[#3E1399] transition-all duration-300"
                            onClick={handleFormSubmit}
                        >
                            Log In
                        </button>

                        <div className="w-full h-max flex flex-col justify-center items-center">
                            <p className="mb-4">or log in with</p>
                            <div className="flex flex-row w-2/3 justify-between">
                                <img
                                    src="../assets/instagram_logo.svg"
                                    alt="instagram"
                                    className="w-6 h-8 hover:scale-105 transition-transform"
                                />
                                <img
                                    src="../assets/facebook_logo.svg"
                                    alt="facebook"
                                    className="w-6 h-8 hover:scale-105 transition-transform"
                                />
                                <img
                                    src="../assets/google_logo.svg"
                                    alt="google"
                                    className="w-6 h-8 hover:scale-105 transition-transform"
                                />
                                <img
                                    src="../assets/linkedin_logo.svg"
                                    alt="linkedin"
                                    className="w-6 h-8 hover:scale-105 transition-transform"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {alertOpen ? (
                <div>
                    <Alert severity={alertMessage.type} className="fixed z-50 right-4 bottom-4">
                        <AlertTitle className="flex justify-between overflow-hidden">
                            {alertMessage.heading}
                            <button className="scale-[1.5]" onClick={handleAlertToggle}>
                                <IoMdClose />
                            </button>
                        </AlertTitle>
                        {alertMessage.message}
                    </Alert>
                </div>
            ) : (
                ''
            )}
        </ThemeProvider>
    );
};

export default LoginPage;
