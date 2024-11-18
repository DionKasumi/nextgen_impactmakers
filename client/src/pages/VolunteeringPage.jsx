import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';

// Function to fetch course data from the API
const fetchVolunteerings = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/api/volunteering'
        );
        return response.data || [];
    } catch (error) {
        console.error('Error fetching volunteerings:', error);
        return [];
    }
};

const fetchFavorites = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/api/favorites',
            {
                withCredentials: true,
            }
        );
        return (response.data || []).map((fav) => fav.card_id);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

const CardsContainer = ({
    volunteerings,
    loadMoreVolunteerings,
    allVolunteeringsLoaded,
    isFilterOpen,
    favoriteIds,
    toggleFavorite,
}) => {
    return (
        <div
            className={`flex justify-center items-center flex-col ${
                isFilterOpen ? 'col-start-1 sm:col-start-2' : 'col-start-1'
            } col-end-5`}
        >
            <div
                className={`w-full h-full grid grid-cols-1 md:grid-cols-2 ${
                    isFilterOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-y-8 justify-items-center`}
            >
                {volunteerings.length > 0
                    ? volunteerings.map((volunteer, index) => (
                          <Card
                              key={index}
                              id={volunteer.id}
                              card_title={volunteer.title}
                              card_img={volunteer.image_url}
                              card_duration={volunteer.duration}
                              card_description={volunteer.description}
                              card_price={volunteer.price}
                              card_source={volunteer.source}
                              card_type="volunteering"
                              isFavorite={favoriteIds.includes(volunteer.id)}
                              onToggleFavorite={() =>
                                  toggleFavorite(volunteer.id)
                              }
                          />
                      ))
                    : Array(6)
                          .fill(null)
                          .map((_, index) => (
                              <SkeletonCard key={index} isSwiperCard={false} />
                          ))}
            </div>

            {!allVolunteeringsLoaded && volunteerings.length > 0 ? (
                <button
                    onClick={loadMoreVolunteerings}
                    className="my-12 bg-white text-black w-2/3 lg:w-1/3 h-14 rounded-lg font-bold"
                >
                    See More
                </button>
            ) : (
                <div className="mb-32"></div>
            )}
        </div>
    );
};

const VolunteeringPage = () => {
    const [volunteerings, setVolunteerings] = useState([]);
    const [visibleVolunteerings, setVisibleVolunteerings] = useState(6);
    const [selectedValues, setSelectedValues] = useState({
        minPrice: '',
        maxPrice: '',
    });
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const volunteeringsData = await fetchVolunteerings();
            setVolunteerings(volunteeringsData.data);

            const favoritesData = await fetchFavorites();
            setFavoriteIds(favoritesData);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        console.log('Search clicked', selectedValues);
    };

    const loadMoreVolunteerings = () => {
        setVisibleVolunteerings(
            (prevVisibleVolunteerings) => prevVisibleVolunteerings + 6
        );
    };

    const allVolunteeringsLoaded = visibleVolunteerings >= volunteerings.length;

    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const handleFilterToggle = (val) => {
        setIsFilterOpen(!val);
    };
    const toggleFavorite = async (id) => {
        try {
            const isFavorite = favoriteIds.includes(id);
            const method = isFavorite ? 'DELETE' : 'POST';
            await axios({
                method,
                url: `http://localhost:8080/api/favorites/${
                    method === 'POST' ? 'add' : 'remove'
                }`,
                data: { card_id: id, card_type: 'volunteering' },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            setFavoriteIds((prev) =>
                isFavorite ? prev.filter((fid) => fid !== id) : [...prev, id]
            );
        } catch (error) {
            console.error('Failed to update favorite status:', error);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-[url('../assets/background.png')]  bg-no-repeat relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">Volunteering</h1>
                    <p className="text-2xl font-light">
                        Pick up your preferences
                    </p>
                </div>
                {/* <div className="flex flex-row justify-between w-5/6 h-auto"> */}
                <div className="grid grid-cols-4 w-5/6 h-auto">
                    <Filter
                        filterList={[
                            {
                                isPrice: false,
                                title: 'Location',
                                items: [
                                    {
                                        display: 'Prishtina',
                                        name: 'location_radio',
                                        id: 'prishtina',
                                        value: 'Prishtina',
                                    },
                                    {
                                        display: 'Gjilan',
                                        name: 'location_radio',
                                        id: 'gjilan',
                                        value: 'Gjilan',
                                    },
                                    {
                                        display: 'Prizren',
                                        name: 'location_radio',
                                        id: 'prizren',
                                        value: 'Prizren',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Cause',
                                items: [
                                    {
                                        display: 'Education and Youth',
                                        name: 'cause_radio',
                                        id: 'education_youth',
                                        value: 'Education and Youth',
                                    },
                                    {
                                        display: 'Health and Wellness',
                                        name: 'cause_radio',
                                        id: 'health_wellness',
                                        value: 'Health and Wellness',
                                    },
                                    {
                                        display: 'Social Services',
                                        name: 'cause_radio',
                                        id: 'social_services',
                                        value: 'Social Services',
                                    },
                                    {
                                        display: 'Arts',
                                        name: 'cause_radio',
                                        id: 'arts',
                                        value: 'Arts',
                                    },
                                    {
                                        display: 'Animal Welfare',
                                        name: 'cause_radio',
                                        id: 'animal_welfare',
                                        value: 'Animal Welfare',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Organization',
                                items: [
                                    {
                                        display: 'ORCA',
                                        name: 'organization_radio',
                                        id: 'orca',
                                        value: 'ORCA',
                                    },
                                    {
                                        display: 'TOKA',
                                        name: 'organization_radio',
                                        id: 'toka',
                                        value: 'TOKA',
                                    },
                                    {
                                        display: 'GLPS',
                                        name: 'organization_radio',
                                        id: 'glps',
                                        value: 'GLPS',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Age group',
                                items: [
                                    {
                                        display: 'Youth(Under 18)',
                                        name: 'age_radio',
                                        id: 'youth',
                                        value: 'Youth(Under 18)',
                                    },
                                    {
                                        display: 'Teens (13-17)',
                                        name: 'age_radio',
                                        id: 'teens',
                                        value: 'Teens (13-17)',
                                    },
                                    {
                                        display: 'Young Adults(18-24)',
                                        name: 'age_radio',
                                        id: 'young_adults',
                                        value: 'Young Adults(18-24)',
                                    },
                                    {
                                        display: 'Adults',
                                        name: 'age_radio',
                                        id: 'adults',
                                        value: 'Adults',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Duration',
                                items: [
                                    {
                                        display: '1 Day',
                                        name: 'duration_radio',
                                        id: 'one_day',
                                        value: '1 Day',
                                    },
                                    {
                                        display: 'Short Period',
                                        name: 'duration_radio',
                                        id: 'short_period',
                                        value: 'Short Period',
                                    },
                                    {
                                        display: 'Continued Engagement',
                                        name: 'duration_radio',
                                        id: 'continued_engagement',
                                        value: 'Continued Engagement',
                                    },
                                ],
                            },
                        ]}
                        selectedValues={selectedValues}
                        handleChange={handleChange}
                        handleSearch={handleSearch}
                        handleFilterToggle={handleFilterToggle}
                    />
                    <CardsContainer
                        volunteerings={
                            Array.isArray(volunteerings)
                                ? volunteerings.slice(0, visibleVolunteerings)
                                : []
                        }
                        loadMoreVolunteerings={loadMoreVolunteerings}
                        allVolunteeringsLoaded={allVolunteeringsLoaded}
                        isFilterOpen={isFilterOpen}
                        favoriteIds={favoriteIds}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
            </div>
        </div>
    );
};

export default SectionWrapper(VolunteeringPage);
