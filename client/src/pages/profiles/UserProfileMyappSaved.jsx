import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UserProfileMyappSaved = () => {
    const { t } = useTranslation();

    const [favorites, setFavorites] = useState([]);
    const [removingId, setRemovingId] = useState(null);
    const [notification, setNotification] = useState('');
    const [username, setUsername] = useState('Username');
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8080/api/favorites',
                    {
                        credentials: 'include',
                    }
                );
                const result = await response.json();
                if (response.ok) {
                    setFavorites(result);
                } else {
                    console.error(result.error || 'Failed to fetch favorites');
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        };

        fetchFavorites();
    }, []);
    const handleRemoveFavorite = async (cardId) => {
        setRemovingId(cardId);
        setTimeout(async () => {
            try {
                await fetch(`http://localhost:8080/api/favorites/remove`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ card_id: cardId }),
                });

                setFavorites((prevFavorites) =>
                    prevFavorites.filter((fav) => fav.card_id !== cardId)
                );
                setNotification('Favorite removed successfully!');
                setTimeout(() => setNotification(''), 2000);
            } catch (error) {
                console.error('Failed to remove favorite:', error);
            }
        }, 500);
    };
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#4F1ABE] via-[#B93DD6] to-[#BC3ED6] flex flex-col items-center py-20 relative">
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
                            <Link
                                to="/profile/saved"
                                className="text-[#FF9202]"
                            >
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
                <div className="flex space-x-2 w-24 h-24 md:mt-20">
                    <button className="text-white text-3xl p-2 ">
                        &#x1F56D;
                    </button>
                    <button className="text-white text-3xl p-2 ">
                        &#9881;
                    </button>
                </div>
            </div>

            <div className="w-full h-full flex justify-center items-center">
                <div className="w-2/4 h-full grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                    {favorites.map((fav) => (
                        <div
                            key={fav.card_id}
                            className={`${
                                removingId === fav.card_id
                                    ? 'opacity-0'
                                    : 'opacity-100'
                            } transition-opacity duration-500 ease-out`}
                        >
                            <Card
                                id={fav.card_id}
                                card_title={fav.card_title}
                                card_img={fav.card_img}
                                card_duration={fav.card_duration}
                                card_description={fav.card_description}
                                card_price={fav.card_price}
                                card_source={fav.card_source}
                                card_type={fav.card_type}
                                isFavorite={true}
                                onToggleFavorite={handleRemoveFavorite}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfileMyappSaved;
