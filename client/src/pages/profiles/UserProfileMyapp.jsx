import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RateCard from '../../components/RateCard';

const UserProfileMyapp = () => {
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
                        <nav className="hidden sm:flex space-x-10 text-white font-bold text-lg">
                            <Link to="/profile/edit">Edit Profile</Link>
                            <Link
                                to="/profile/myapp"
                                className="text-[#FF9202]"
                            >
                                My applications
                            </Link>
                            <Link to="/profile/saved">Saved for Later</Link>
                            <Link to="/profile/rate">Rate this Website</Link>
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

            <div className="w-full h-full flex justify-center items-center">
                <div className="w-3/4 h-full grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                    {Array(6)
                        .fill(null)
                        .map((_, index) => (
                            <RateCard
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
        </div>
    );
};

export default UserProfileMyapp;
