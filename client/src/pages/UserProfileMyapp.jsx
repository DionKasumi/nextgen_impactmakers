import React from 'react';
import SwiperCarousel from '../components/SwiperCarousel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserProfileMyapp = () => {
    const [carouselData, setCarouselData] = useState([]);

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const endpoint = `http://localhost:8080/api/courses`;

                const response = await axios.get(endpoint);

                if (response.status === 200) {
                    const result = response.data;
                    let gatheredData = [];

                    if (typeof result === 'object') {
                        gatheredData = result
                            .slice(0, 5)
                            .map((item) => ({ ...item, type: 'courses' }));
                    }
                    setCarouselData(gatheredData);
                } else {
                    console.error('Failed to fetch cards');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCarouselData();
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
                            Username
                        </p>
                        <nav className="hidden sm:flex space-x-10  text-white font-bold text-lg">
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
                <div className="flex space-x-2 w-24 h-24 md:mt-20">
                    <button className="text-white text-3xl p-2 ">
                        &#x1F56D;
                    </button>
                    <button className="text-white text-3xl p-2 ">
                        &#9881;
                    </button>
                </div>
            </div>
            {/* Swiper Carousel */}
            <SwiperCarousel data={carouselData} />
            <div className="w-1/2 rounded-lg mr-80 mb-44 z-10">
                <div className="grid grid-cols-[3fr_1fr] gap-8"></div>
            </div>
        </div>
    );
};

export default UserProfileMyapp;
