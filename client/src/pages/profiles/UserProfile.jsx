import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
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
                            {username || 'Username'}
                        </p>
                        <nav className="hidden sm:flex space-x-5 text-white font-bold text-lg">
                            <Link to="/profile/edit">
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
            {/* Group 704 Icon in the Red Circle Position */}
            <div className="relative flex justify-center items-center mb-4">
                <img
                    src="assets/Group 704.png"
                    alt="Group Icon"
                    className="w-10 h-10 -mb-60 ml-64 md:-mb-20 md:ml-96 sm:w-12 sm:h-12 sm:-mb-60 sm:ml-96 md:w-14 md:h-14 lg:w-16 lg:h-16"
                />
            </div>
            {/* Welcome */}
            <div className="text-center mt-20 h-auto relative w-full max-w-sm md:max-w-lg mb-96 px-4">
                <div className="space-y-8">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {t('profile.participant.welcome')},{' '}
                        {username || 'Username'}
                        <hr className="absolute left-0 right-0 mx-auto top-12 h-1 bg-white" />
                    </h1>
                    <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-semibold">
                        {t('profile.participant.upcoming-opportunities')}
                        <hr className="absolute left-0 right-0 mx-auto top-full h-0.5 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </h1>
                    <h1 className="relative group text-white text-lg sm:text-xl md:text-2xl font-semibold hover:text-3xl">
                        Opportunity 1: Deadline
                    </h1>
                    <h1 className="relative group text-white text-lg sm:text-xl md:text-xl font-semibold hover:text-2xl">
                        Opportunity 2: Deadline
                    </h1>
                    <h1 className="relative group text-white text-sm sm:text-lg md:text-lg font-semibold hover:text-xl">
                        Opportunity 3: Deadline
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
