import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/Footer';

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
        <div className="min-h-screen w-full bg-custom-gradient-2 flex flex-col items-center py-20 relative">
            <img
                src="/assets/bg-design.png"
                alt=""
                className="absolute bottom-0 left-0 z-10 opacity-50"
            />

            {/* Profile Header */}
            <div className="flex flex-col items-center md:flex-row md:justify-between w-full max-w-2xl md:max-w-4xl lg:max-w-5xl p-4 mb-8 md:mb-10 z-20">
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

            <div className="mb-24 sm:mb-16">
                <img
                    src="assets/Group 704.png"
                    alt="Group Icon"
                    // className="w-10 h-10 -mb-60 ml-64 md:-mb-20 md:ml-96 sm:w-12 sm:h-12 sm:-mb-60 sm:ml-96 md:w-14 md:h-14 lg:w-16 lg:h-16"
                    className="w-24 absolute left-[80%] md:left-2/3 -translate-x-1/2"
                />
            </div>

            {/* Welcome */}
            <div className="text-center h-auto relative w-full max-w-sm md:max-w-lg mb-32 px-4 z-20 overflow-x-hidden">
                <div className="space-y-8">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {t('profile.participant.welcome')},{' '}
                        {username || 'Username'}
                        <hr className="absolute left-0 right-0 mx-auto top-12 h-[2px] bg-white w-4/5" />
                    </h1>
                    <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-semibold">
                        {t('profile.participant.upcoming-opportunities')}
                    </h1>
                    <h1 className="relative group text-white text-lg sm:text-xl md:text-2xl font-semibold hover:scale-105 transition-transform">
                        Opportunity 1: Deadline
                    </h1>
                    <h1 className="relative group text-white text-sm sm:text-lg md:text-xl font-semibold hover:scale-105 transition-transform">
                        Opportunity 2: Deadline
                    </h1>
                    <h1 className="relative group text-white text-xs sm:text-sm md:text-lg font-semibold hover:scale-105 transition-transform">
                        Opportunity 3: Deadline
                    </h1>
                </div>
            </div>

            <Footer withBackground={false} />
        </div>
    );
};

export default UserProfile;
