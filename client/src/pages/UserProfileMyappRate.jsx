import React from 'react';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const UserProfileMyappRate = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#4F1ABE',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
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
                                Username
                            </p>
                            <nav className="hidden sm:flex space-x-10  text-white font-bold text-lg">
                                <Link to="/profile/edit">Edit Profile</Link>
                                <Link to="/profile/myapp">My applications</Link>
                                <Link to="/profile/saved">Saved for Later</Link>
                                <Link
                                    to="/profile/rate"
                                    className="text-[#FF9202]"
                                >
                                    Rate this Website
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="flex space-x-2 w-24 h-24 md:mt-20">
                        <button className="text-white text-3xl p-2 ">
                            &#x1F56D;
                        </button>
                        <button className="text-white text-3xl p-2 ">
                            &#9881;
                        </button>
                    </div>
                </div>
                <div className="w-full h-auto flex justify-center">
                    <div className="w-2/3 h-full flex flex-col justify-center items-end">
                        <TextField
                            id="review"
                            label="Write your review here..."
                            className="w-full lg:w-3/4 p-4 rounded-md resize-none bg-white"
                            multiline
                            rows={8}
                            variant="filled"
                        />
                        <button className="my-4 px-6 py-4 bg-[#50BACF] text-white font-semibold rounded-md hover:bg-[#4ba8bb] hover:scale-105 transition-all z-30">
                            Save changes
                        </button>
                    </div>
                </div>

                <div className="w-1/2 rounded-lg mr-80 mb-44 z-10">
                    <div className="grid grid-cols-[3fr_1fr] gap-8"></div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default UserProfileMyappRate;
