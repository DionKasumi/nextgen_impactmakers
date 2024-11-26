import { useNavigate } from 'react-router-dom';
import SectionWrapper from '../hoc/SectionWrapper';
import SwiperCarousel from '../components/SwiperCarousel';
import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import Footer from '../components/Footer';
import '../styles/HomePageStyles.css';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4F1ABE',
            },
        },
    });

    const { t } = useTranslation();

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
                        {t('pages.home-page.part-1.text-1')}
                    </h1>
                </div>
                {/* Dropdown and Button */}
                <div className="mb-12 md:mb-20 flex flex-col md:flex-row items-center justify-center">
                    <ThemeProvider theme={theme}>
                        <FormControl
                            variant="filled"
                            size="small"
                            sx={{ minWidth: 200 }}
                        >
                            <InputLabel id="select-category-label">
                                {t('pages.home-page.part-1.input')}
                            </InputLabel>
                            <Select
                                labelId="select-category-label"
                                id="selected-category"
                                name="selected-category"
                                value={selectedCategory}
                                label={t('pages.home-page.part-1.input')}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                style={{ backgroundColor: 'white' }}
                            >
                                <MenuItem value={'1'}>
                                    {t('pages.general-text.evit.events')}
                                </MenuItem>
                                <MenuItem value={'2'}>
                                    {t('pages.general-text.evit.internships')}
                                </MenuItem>
                                <MenuItem value={'3'}>
                                    {t('pages.general-text.evit.volunteering')}
                                </MenuItem>
                                <MenuItem value={'4'}>
                                    {t('pages.general-text.evit.trainings')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                    <button
                        type="button"
                        className="w-full md:w-auto py-2 px-10 md:px-20 bg-[#44FFD1] text-black font-semibold rounded mt-4 md:ml-4 md:mt-0"
                        onClick={handleSearch}
                    >
                        {t('pages.home-page.part-1.search')}
                    </button>
                </div>
                {/* Swiper Carousel */}
                <SwiperCarousel data={carouselData} favoriteIds={favoriteIds} />
            </div>
        </div>
    );
};

const SecondPart = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-[#FFFFFF] text-#030007 py-12 sm:py-16 md:py-24 lg:py-32 w-full">
            <div className="container mx-auto text-center px-4 sm:px-8 lg:px-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold mb-4 sm:mb-6 lg:mb-16">
                    {t('pages.home-page.part-2.text-1')}
                </h2>
                <p className="text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg lg:max-w-xl mx-auto leading-relaxed">
                    {t('pages.home-page.part-2.text-2')}
                </p>
            </div>
        </div>
    );
};

const ThirdPart = () => {
    const { t } = useTranslation();
    return (
        <div className="relative w-full h-auto py-10 bg-transparent flex justify-center">
            <div className="w-full md:w-4/5 xl:max-w-[70%] 2xl:max-w-[45%] h-full relative flex flex-col items-center justify-center text-white py-16 px-4 sm:px-8 overflow-hidden">
                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 md:mb-16 z-10">
                    {t('pages.home-page.part-3.text-1')}
                </h2>
                <div className="w-56 rounded-full aspect-square hidden sm:flex absolute z-[1] right-0 top-16 bg-gradient-to-br from-[#bc42c5] from-10% to-[#ffffff]"></div>
                <div className="backdrop-blur-sm border-[2px] border-[rgba(255,255,255,0.3)] bg-gradient-to-b from-[rgba(224,224,231,0.6)] to-transparent rounded-3xl p-10 md:p-16 lg:p-20 shadow-2xl w-full z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
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
                                    {t('pages.general-text.evit.internships')}
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
                                    {t('pages.general-text.evit.trainings')}
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
                                    {t('pages.general-text.evit.volunteering')}
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
                                    {t('pages.general-text.evit.events')}
                                </button>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="w-40 rounded-full aspect-square hidden sm:flex absolute z-[1] left-0 bottom-0 bg-gradient-to-bl from-[#ffffff] from-10% to-[#9106d1]"></div>
            </div>
        </div>
    );
};

const FourthPart = () => {
    const [startCounter, setStartCounter] = useState(false);
    const counterRef = useRef(null);

    const { t } = useTranslation();
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
                    {t('pages.home-page.part-4.text-1')}
                </h1>

                <h2 className="text-lg md:text-2xl lg:text-3xl text-black text-center mb-24 font-poppins font-light">
                    {t('pages.home-page.part-4.text-2')}
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
                                <CountUp
                                    end={t(
                                        'pages.home-page.part-4.stats.individuals.amount'
                                    )}
                                    duration={2}
                                />
                            ) : (
                                '0'
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mt-12">
                            {t(
                                'pages.home-page.part-4.stats.individuals.label'
                            )}
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
                                <CountUp
                                    end={t(
                                        'pages.home-page.part-4.stats.organizations.amount'
                                    )}
                                    duration={2}
                                />
                            ) : (
                                '0'
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mt-12">
                            {t(
                                'pages.home-page.part-4.stats.organizations.label'
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FifthPart = () => {
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

    const { t } = useTranslation();
    return (
        <div
            className={`w-full h-full ${
                testimonialLength >= 3 ? 'flex' : 'hidden'
            } flex-col justify-center items-center py-20`}
        >
            <div className="text-white text-5xl font-bold mb-20 md:mb-48">
                {t('pages.home-page.part-5.text-1')}
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
    const { t } = useTranslation();
    return (
        <div className="relative w-full min-h-[500px] overflow-hidden px-4">
            <img
                src="../assets/sixpart.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center text-2xl md:text-3xl font-light z-10">
                    {t('pages.home-page.part-6.text-1')}
                </div>
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

    const { t } = useTranslation();
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#4F1ABE] bg-[url('../assets/group1.png')] bg-no-repeat bg-cover px-4 md:px-8 lg:px-0 py-20 md:py-32">
            <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl text-white text-center font-bold mb-4 md:mb-8">
                    {t('pages.home-page.part-7.text-1')}
                </h1>
                <h2 className="text-lg md:text-2xl lg:text-3xl text-white text-center font-light mb-10 md:mb-12">
                    {t('pages.home-page.part-7.text-2')}
                </h2>
            </div>
            <SwiperCarousel data={carouselData} favoriteIds={favoriteIds} />
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
        <div className="w-full h-full flex flex-col z-10">
            <div className="w-full h-full flex flex-col bg-custom-gradient-1">
                <FirstPart favoriteIds={favoriteIds} />
                <SecondPart />
                <ThirdPart />
                <FourthPart />
                <FifthPart favoriteIds={favoriteIds} />
            </div>
            <SixthPart />
            <SeventhPart />
            <Footer />
        </div>
    );
};

export default SectionWrapper(HomePage);
