import { useNavigate } from 'react-router-dom';
import SectionWrapper from '../hoc/SectionWrapper';
import SwiperCarousel from '../components/SwiperCarousel';
import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';

axios.defaults.withCredentials = true;

const FirstPart = ({ favoriteIds }) => {
    const [carouselData, setCarouselData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const checkSession = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/session'
            );
            return response.data.isLoggedIn; // Return boolean
        } catch (error) {
            console.error('Error checking session:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const loggedIn = await checkSession();
                const endpoint = loggedIn
                    ? `http://localhost:8080/api/user/all_data`
                    : `http://localhost:8080/api/courses`;

                const response = await axios.get(endpoint);

                if (response.status === 200) {
                    const result = response.data;
                    let gatheredData = [];

                    if (loggedIn && typeof result === 'object') {
                        // Check for valid keys and process data
                        const categories = [
                            'courses',
                            'events',
                            'internships',
                            'volunteering',
                        ];
                        for (const category of categories) {
                            if (
                                Array.isArray(result[category]) &&
                                result[category].length > 0
                            ) {
                                const remainingSlots = 5 - gatheredData.length;

                                const itemsWithCategory = result[category]
                                    .slice(0, remainingSlots)
                                    .map((item) => ({
                                        ...item,
                                        type: category,
                                    }));

                                gatheredData.push(...itemsWithCategory);

                                if (gatheredData.length >= 5) break; // Stop when there is 5 items
                            }
                        }
                    } else if (Array.isArray(result.data)) {
                        // For non-logged-in users
                        gatheredData = result.data
                            .slice(0, 5)
                            .map((item) => ({ ...item, type: 'courses' }));
                    }

                    setCarouselData(gatheredData);
                } else {
                    console.error('Failed to fetch data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        fetchCarouselData();
    }, []);

    const handleSearch = () => {
        // Determine the route based on the selected category
        switch (selectedCategory) {
            case '1':
                navigate('/events');
                break;
            case '2':
                navigate('/internships');
                break;
            case '3':
                navigate('/volunteering');
                break;
            case '4':
                navigate('/trainings');
                break;
            default:
                alert('Please select a category');
        }
    };

    return (
        <div className="w-full h-full pt-20 sm:pt-32 md:pt-40 flex flex-col justify-center items-center bg-transparent">
            <div className="w-full min-h-svh items-center flex flex-col relative top-[15%] md:top-[20%] px-4 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row items-center md:justify-center space-x-4 md:space-x-8">
                    {/* Image Container */}
                    <div className="flex-shrink-0">
                        <img
                            src="../assets/Group 703.png"
                            alt="Decorative Image"
                            className="w-25 h-20 mb-4 mr-24 md:mb-10 md:w-25 md:h-20 object-cover opacity-100"
                        />
                    </div>
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-white mb-6 pr-10 md:mb-8 font-bold text-center md:text-left whitespace-nowrap">
                        Opportunities in One!
                    </h1>
                </div>
                {/* Dropdown and Button */}
                <div className="mb-12 md:mb-20 flex flex-col md:flex-row items-center justify-center">
                    <select
                        className="w-full md:w-auto mb-4 md:mb-0 md:mr-5 border border-gray-300 rounded px-8 md:px-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="select-category"
                        id="select-category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" disabled>
                            Select category
                        </option>
                        <option value="1">Events</option>
                        <option value="2">Internships</option>
                        <option value="3">Volunteering</option>
                        <option value="4">Trainings</option>
                    </select>
                    <button
                        type="button"
                        className="w-full md:w-auto py-2 px-10 md:px-20 bg-[#44FFD1] text-black font-semibold rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                {/* Swiper Carousel */}
                <SwiperCarousel data={carouselData} favoriteIds={favoriteIds} />
            </div>
            {/* Chatbot Image */}
            <div className="fixed bottom-5 right-5 m-5">
                <img
                    src="../assets/image 1.png"
                    alt="chatbot"
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-25 lg:h-25 object-cover"
                />
            </div>
        </div>
    );
};

const SecondPart = () => {
    return (
        <div className="bg-[#FFFFFF] text-#030007 py-12 sm:py-16 md:py-24 lg:py-32 min-h-[300px] md:min-h-[500px] w-full">
            <div className="container mx-auto text-center px-4 sm:px-8 lg:px-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold mb-4 sm:mb-6 lg:mb-16">
                    ABOUT YEP
                </h2>
                <p className="text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg lg:max-w-xl mx-auto leading-relaxed">
                    A Platform Aimedlimed At Providing A Trustful Source Of All
                    Events, Trainings, Interships And Volunteering Opportunities
                    In Kosova
                </p>
            </div>
        </div>
    );
};

const ThirdPart = () => {
    return (
        <div className="relative w-full h-auto py-10 bg-transparent">
            <div className="relative flex flex-col items-center justify-center h-full text-white py-16 px-4 sm:px-8">
                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 md:mb-16">
                    Our Services
                </h2>
                <div className="backdrop-blur-sm border-[2px] border-[rgba(255,255,255,0.3)] bg-gradient-to-b from-[rgba(255,255,255,0.40)] to-transparent rounded-3xl p-20 shadow-2xl max-w-4xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
                        <a href="/internships" className="group">
                            <div className="relative flex flex-col items-center">
                                <img
                                    src="../assets/interships.png"
                                    alt="internships"
                                    className="w-full h-40 sm:h-52 md:h-64 lg:h-72 object-cover rounded-lg transition-transform duration-300 ease-in-out"
                                />
                                <img
                                    src="../assets/image 9.png"
                                    alt="internships Hover"
                                    className="absolute top-0 left-0 w-full h-40 sm:h-52 md:h-64 lg:h-72 rounded-lg object-cover opacity-0 transition-opacity duration-300"
                                />
                                <button className="px-10 py-2 mt-3 text-white text-lg font-semibold font-inter rounded-full border border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    Internships
                                </button>
                            </div>
                        </a>

                        <a href="/trainings" className="group">
                            <div className="relative flex flex-col items-center">
                                <img
                                    src="../assets/trainings.png"
                                    alt="trainings"
                                    className="w-full h-40 sm:h-52 md:h-64 lg:h-72 object-cover rounded-lg transition-transform duration-300 ease-in-out"
                                />
                                <img
                                    src="../assets/image 9.png"
                                    alt="trainings Hover"
                                    className="absolute top-0 left-0 w-full h-40 sm:h-52 md:h-64 lg:h-72 rounded-lg object-cover opacity-0 transition-opacity duration-300"
                                />
                                <button className="px-10 py-2 mt-3 text-white text-lg font-semibold font-inter rounded-full border border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    Trainings
                                </button>
                            </div>
                        </a>

                        <a href="/volunteering" className="group">
                            <div className="relative flex flex-col items-center">
                                <img
                                    src="../assets/volunteering.png"
                                    alt="volunteering"
                                    className="w-full h-40 sm:h-52 md:h-64 lg:h-72 object-cover rounded-lg transition-transform duration-300 ease-in-out"
                                />
                                <img
                                    src="../assets/image 9.png"
                                    alt="volunteering Hover"
                                    className="absolute top-0 left-0 w-full h-40 sm:h-52 md:h-64 lg:h-72 rounded-lg object-cover opacity-0 transition-opacity duration-300"
                                />
                                <button className="px-10 py-2 mt-3 text-white text-lg font-semibold font-inter rounded-full border border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    Volunteering
                                </button>
                            </div>
                        </a>

                        <a href="/events" className="group">
                            <div className="relative flex flex-col items-center">
                                <img
                                    src="../assets/events.png"
                                    alt="events"
                                    className="w-full h-40 sm:h-52 md:h-64 lg:h-72 object-cover rounded-lg transition-transform duration-300 ease-in-out"
                                />
                                <img
                                    src="../assets/image 9.png"
                                    alt="events Hover"
                                    className="absolute top-0 left-0 w-full h-40 sm:h-52 md:h-64 lg:h-72 rounded-lg object-cover opacity-0 transition-opacity duration-300"
                                />
                                <button className="px-10 py-2 mt-3 text-white text-lg font-semibold font-inter rounded-full border border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    Events
                                </button>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FourthPart = () => {
    const [startCounter, setStartCounter] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setStartCounter(true); // Start counter when in view
                } else {
                    setStartCounter(false);
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
        };
    }, []);

    return (
        <div ref={counterRef} className="relative w-full h-auto py-20 bg-white">
            <img
                src="../assets/registered.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative flex flex-col items-center justify-center h-full bg-black bg-opacity-0 px-4 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-black text-center mb-6 font-bold">
                    Registered
                </h1>

                <h2 className="text-lg md:text-2xl lg:text-3xl text-black text-center mb-24 font-poppins font-light">
                    Users and Organizations
                </h2>

                <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 md:gap-20 lg:gap-32 max-w-4xl mx-auto text-center overflow-x-auto">
                    {/* Individuals Counter */}
                    <div className="text-black flex flex-col items-center italic">
                        <img
                            src="../assets/individuals.png"
                            alt="Individuals"
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-24"
                        />
                        <h1 className="text-3xl md:text-4xl lg:text-5xl text-black text-center font-bold">
                            {startCounter ? (
                                <CountUp end={50000} duration={2} />
                            ) : (
                                '0'
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mt-12">
                            Individuals
                        </p>
                    </div>

                    {/* Organizations Counter */}
                    <div className="text-black flex flex-col items-center italic ">
                        <img
                            src="../assets/organization.png"
                            alt="Organizations"
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-24"
                        />
                        <h1 className="text-3xl md:text-4xl lg:text-5xl text-black text-center font-bold">
                            {startCounter ? (
                                <CountUp end={50001} duration={2} />
                            ) : (
                                '0'
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mt-12">
                            Organizations
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const FivethPart = () => {
    const [selectedCard, setSelectedCard] = useState('');
    const [reviews, setReviews] = useState([]);
    const [testimonialLength, setTestimonialLength] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:8080/api/retrieve_reviews'
                );
                setReviews(response.data);

                // Set the default selected card to the second card if it exists
                setTestimonialLength(response.data.length);
                if (response.data.length >= 3) {
                    setSelectedCard(response.data[1].username);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    // Ensure we always have 3 reviews to display
    const cards = [
        {
            id: 1,
            review: reviews[0] || {
                username: 'N/A',
                review: 'No review available',
            },
        },
        {
            id: 2,
            review: reviews[1] || {
                username: 'N/A',
                review: 'No review available',
            },
        },
        {
            id: 3,
            review: reviews[2] || {
                username: 'N/A',
                review: 'No review available',
            },
        },
    ];

    return (
        <div
            className={`w-full h-full ${
                testimonialLength >= 3 ? 'flex' : 'hidden'
            } flex-col justify-center items-center py-20`}
        >
            <div className="text-white text-5xl font-bold mb-20 md:mb-48">
                Reviews
            </div>

            <div className="relative w-full flex justify-center items-center flex-col space-y-20 md:flex-row md:-space-x-60 md:space-y-0">
                {cards.map((card, index) => (
                    <TestimonialCard
                        key={index}
                        card={card}
                        index={index}
                        selectedCard={selectedCard}
                        changeSelectedCard={(e) => {
                            setSelectedCard(card.review.username);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
const SixthPart = () => {
    return (
        <div className="relative w-full min-h-[500px] overflow-hidden px-4">
            <img
                src="../assets/sixpart.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center text-2xl md:text-3xl font-light z-10">
                    Never stop growing with YEP!
                </div>
            </div>
        </div>
    );
};

const TestimonialCard = ({ card, index, selectedCard, changeSelectedCard }) => {
    return (
        <div
            onClick={() => changeSelectedCard(card.review.username)}
            className={`relative flex flex-col md:flex-row justify-center items-center rounded-xl w-3/4 md:w-2/5 h-36 p-4 shadow-lg transition-transform duration-200 ease-in-out select-none
                        ${
                            selectedCard === card.review.username
                                ? 'z-40 md:-top-20 scale-110'
                                : 'z-10 scale-100'
                        } 
                        ${
                            index === 0
                                ? 'bg-[#4FEAC6]'
                                : index === 1
                                ? 'bg-[#F6F49D]'
                                : 'bg-[#B3B5FF]'
                        }`}
        >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white"></div>
            <div className="flex w-full h-full flex-col justify-start p-4">
                <h1 className="text-lg mb-4 self-start">
                    - {card.review.username}
                </h1>
                <p className="text-sm md:text-base text-black text-wrap whitespace-nowrap break-words line-clamp-1">
                    "{card.review.review}"
                </p>
            </div>
        </div>
    );
};

const SeventhPart = ({ favoriteIds }) => {
    const [carouselData, setCarouselData] = useState([]);
    const checkSession = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/session'
            );
            return response.data.isLoggedIn; // Return boolean
        } catch (error) {
            console.error('Error checking session:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const loggedIn = await checkSession();
                const endpoint = loggedIn
                    ? `http://localhost:8080/api/user/all_data`
                    : `http://localhost:8080/api/courses`;

                const response = await axios.get(endpoint);

                if (response.status === 200) {
                    const result = response.data;
                    let gatheredData = [];

                    if (loggedIn && typeof result === 'object') {
                        // Check for valid keys and process data
                        const categories = [
                            'courses',
                            'events',
                            'internships',
                            'volunteering',
                        ];
                        for (const category of categories) {
                            if (
                                Array.isArray(result[category]) &&
                                result[category].length > 0
                            ) {
                                const remainingSlots = 5 - gatheredData.length;

                                const itemsWithCategory = result[category]
                                    .slice(0, remainingSlots)
                                    .map((item) => ({
                                        ...item,
                                        type: category,
                                    }));

                                gatheredData.push(...itemsWithCategory);

                                if (gatheredData.length >= 5) break; // Stop when there is 5 items
                            }
                        }
                    } else if (Array.isArray(result.data)) {
                        // For non-logged-in users
                        gatheredData = result.data
                            .slice(0, 5)
                            .map((item) => ({ ...item, type: 'courses' }));
                    }

                    setCarouselData(gatheredData);
                } else {
                    console.error('Failed to fetch data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        fetchCarouselData();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#4F1ABE] bg-[url('../assets/group1.png')] bg-no-repeat bg-cover px-4 md:px-8 lg:px-0 py-20 md:py-32">
            <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl text-white text-center font-bold mb-4 md:mb-8">
                    Upcoming Opportunities
                </h1>
                <h2 className="text-lg md:text-2xl lg:text-3xl text-white text-center font-light mb-10 md:mb-12">
                    Find your next opportunity
                </h2>
            </div>
            <SwiperCarousel data={carouselData} favoriteIds={favoriteIds} />
        </div>
    );
};

const HomePage = () => {
    const checkSession = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/session'
            );
            return response.data.isLoggedIn; // Return boolean
        } catch (error) {
            console.error('Error checking session:', error);
            return false;
        }
    };

    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchFavoriteIds = async () => {
            try {
                const loggedIn = await checkSession();
                if (loggedIn) {
                    const response = await axios.get(
                        'http://localhost:8080/api/favorites'
                    );
                    if (response.status === 200) {
                        setFavoriteIds(response.data.map((fav) => fav.card_id));
                    }
                }
                /*else {
                    console.log('Not LoggedIn');
                }*/
            } catch (error) {
                console.error('Error fetching favorite IDs:', error);
            }
        };

        fetchFavoriteIds();
    }, []);
    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#4F1ABE] via-[#A540D9] to-[#BC3ED6]">
            <FirstPart favoriteIds={favoriteIds} />
            <SecondPart />
            <ThirdPart />
            <FourthPart />
            <FivethPart favoriteIds={favoriteIds} />
            <SixthPart />
            <SeventhPart />
        </div>
    );
};

export default SectionWrapper(HomePage);
