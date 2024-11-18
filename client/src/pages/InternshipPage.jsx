import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import axios from 'axios';
import SkeletonCard from '../components/SkeletonCard';

// Function to fetch internships data from the API
const fetchInternships = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/api/internships'
        );
        return response.data || [];
    } catch (error) {
        console.error('Error fetching internships:', error);
        return [];
    }
};
const fetchFavorites = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/api/favorites',
            { withCredentials: true }
        );
        return (response.data || []).map((fav) => fav.card_id);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

const CardsContainer = ({
    internships,
    loadMoreInternships,
    allInternshipsLoaded,
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
                {internships.length > 0
                    ? internships.map((internship, index) => (
                          <Card
                              key={index}
                              id={internship.id}
                              card_title={internship.title}
                              card_img={internship.image_url}
                              card_duration={internship.duration}
                              card_description={internship.description}
                              card_price={internship.price}
                              card_source={internship.source}
                              card_type="internships"
                              isFavorite={favoriteIds.includes(internship.id)}
                              onToggleFavorite={() =>
                                  toggleFavorite(internship.id)
                              }
                          />
                      ))
                    : Array(6)
                          .fill(null)
                          .map((_, index) => (
                              <SkeletonCard key={index} isSwiperCard={false} />
                          ))}
            </div>

            {!allInternshipsLoaded && internships.length > 0 ? (
                <button
                    onClick={loadMoreInternships}
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

const InternshipsPage = () => {
    const [internships, setInternships] = useState([]);
    const [visibleInternships, setVisibleInternships] = useState(6);
    const [selectedValues, setSelectedValues] = useState({
        minPrice: '',
        maxPrice: '',
    });
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const internshipsData = await fetchInternships();
            setInternships(internshipsData.data);

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

    const loadMoreInternships = () => {
        setVisibleInternships(
            (prevVisibleInternships) => prevVisibleInternships + 6
        );
    };

    const allInternshipsLoaded = visibleInternships >= internships.length;

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
                data: { card_id: id, card_type: 'internships' },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            // Update UI immediately
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
                    <h1 className="text-5xl font-bold mb-6">Internships</h1>
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
                                title: 'Internship type',
                                items: [
                                    {
                                        display: 'Graphic Design',
                                        name: 'Internship_radio',
                                        id: 'graphic_design',
                                        value: 'Graphic Design',
                                    },
                                    {
                                        display: 'Programming',
                                        name: 'Internship_radio',
                                        id: 'Programing',
                                        value: 'Programming',
                                    },
                                    {
                                        display: 'Social Media Manager',
                                        name: 'Internship_radio',
                                        id: 'social_media',
                                        value: 'Social Media Manager',
                                    },
                                    {
                                        display: 'Medicine',
                                        name: 'Medicine_radio',
                                        id: 'Medicine',
                                        value: 'Medicine',
                                    },
                                ],
                            },
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
                                title: 'Special Features',
                                items: [
                                    {
                                        display: 'Remote',
                                        name: 'Special_radio',
                                        id: 'remote',
                                        value: 'Remote',
                                    },
                                    {
                                        display: 'In office',
                                        name: 'Special_radio',
                                        id: 'in_office',
                                        value: 'In office',
                                    },
                                    {
                                        display: 'Hybrid',
                                        name: 'Special_radio',
                                        id: 'hybrid',
                                        value: 'Hybrid',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Type',
                                items: [
                                    {
                                        display: 'Part-time',
                                        name: 'type_radio',
                                        id: 'part_time',
                                        value: 'Part Time',
                                    },
                                    {
                                        display: 'Full time',
                                        name: 'type_radio',
                                        id: 'Full_time',
                                        value: 'Full Time',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Level of Studies',
                                items: [
                                    {
                                        display: 'High School',
                                        name: 'duration_radio',
                                        id: 'High_School',
                                        value: 'High School',
                                    },
                                    {
                                        display: 'Undergraduate',
                                        name: 'duration_radio',
                                        id: 'Undergraduate',
                                        value: 'Undergraduate',
                                    },
                                    {
                                        display: 'Bachelor Degree',
                                        name: 'duration_radio',
                                        id: 'Bachelor_Degree',
                                        value: 'Bachelor Degree',
                                    },
                                    {
                                        display: 'Master Degree',
                                        name: 'duration_radio',
                                        id: 'Master_Degree',
                                        value: 'Master Degree',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'level',
                                items: [
                                    {
                                        display: '3 Months',
                                        name: 'level_radio',
                                        id: 'three_months',
                                        value: '3 Months',
                                    },
                                    {
                                        display: '4 Months',
                                        name: 'level_radio',
                                        id: 'four_months',
                                        value: '4 Months',
                                    },
                                    {
                                        display: '6 Months',
                                        name: 'level_radio',
                                        id: 'six_months',
                                        value: '6 Months',
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
                        internships={
                            Array.isArray(internships)
                                ? internships.slice(0, visibleInternships)
                                : []
                        }
                        loadMoreInternships={loadMoreInternships}
                        allInternshipsLoaded={allInternshipsLoaded}
                        isFilterOpen={isFilterOpen}
                        favoriteIds={favoriteIds}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
            </div>
        </div>
    );
};

export default SectionWrapper(InternshipsPage);
