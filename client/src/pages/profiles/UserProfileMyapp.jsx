import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RateCard from '../../components/RateCard';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/Footer';

const UserProfileMyapp = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('Username');

    const [applications, setApplications] = useState([]); // Store applications

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/user/profile',
                    {
                        withCredentials: true, // Include session credentials
                    }
                );
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchApplications = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/applications',
                    {
                        withCredentials: true,
                    }
                );

                console.log('Fetched applications:', response.data); // Debug response
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchUserData();
        fetchApplications();
    }, []);

    return (
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
                            <Link to="/profile/edit">
                                {t(
                                    'profile.participant.navigation.edit-profile'
                                )}
                            </Link>
                            <Link
                                to="/profile/myapp"
                                className="text-[#FF9202]"
                            >
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

            <div className="w-full h-full flex justify-center items-center z-20">
                <div className="w-3/4 h-full grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                    {applications.length > 0 ? (
                        applications.map((app) => {
                            console.log("Application Data for RateCard:", app); // Debug application data
                            return (
                                <RateCard
                                    key={app.card_id}
                                    id={app.card_id}
                                    card_title={app.card_title}
                                    card_img={app.card_img}
                                    card_duration={app.card_duration}
                                    card_description={app.card_description}
                                    card_price={app.card_price}
                                    card_source={app.card_source}
                                    card_type={app.card_type}
                                />
                            );
                        })
                    ) : (
                        <p className="text-white text-center">
                            {t('profile.participant.no-applications')}
                        </p>
                    )}
                </div>
            </div>
            <Footer withBackground={false} />
        </div>
    );
};

export default UserProfileMyapp;
