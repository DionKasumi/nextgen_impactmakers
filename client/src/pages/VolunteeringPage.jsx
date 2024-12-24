import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const fetchVolunteerings = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/volunteering');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching volunteerings:', error);
        return [];
    }
};

const fetchVolunteeringLabels = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/volunteering/labels');
        let labels = response.data;

        // Ensure "Other" is at the end of the labels array
        labels = labels.filter((label) => label !== "Activities for Youth");
        labels.push("Activities for Youth");

        console.log("Volunteering labels fetched:", labels);
        return labels;
    } catch (error) {
        console.error('Error fetching volunteering labels:', error);
        return [];
    }
};

const fetchFavorites = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/favorites', {
            withCredentials: true,
        });

        return (response.data || []).map((fav) => `${fav.card_id}-${fav.card_type}`);
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
                              isFavorite={favoriteIds.includes(
                                  `${volunteer.id}-volunteering`
                              )}
                              onToggleFavorite={() =>
                                  toggleFavorite(volunteer.id, 'volunteering')
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
    const [filteredVolunteerings, setFilteredVolunteerings] = useState([]);
    const [labels, setLabels] = useState([]);
    const [visibleVolunteerings, setVisibleVolunteerings] = useState(6);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const volunteeringsData = await fetchVolunteerings();
            setVolunteerings(volunteeringsData.data);
            setFilteredVolunteerings(volunteeringsData.data);

            const labelsData = await fetchVolunteeringLabels();
            setLabels(labelsData);

            const favoritesData = await fetchFavorites();
            setFavoriteIds(favoritesData);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === 'Volunteering_checkbox') {
            setSelectedFilters((prevFilters) => {
                if (checked) return [...prevFilters, value];
                return prevFilters.filter((filter) => filter !== value);
            });
        }
    };

    const handleSearch = async () => {
        try {
            if (selectedFilters.length === 0) {
                setFilteredVolunteerings(volunteerings);
            } else {
                const response = await axios.get(
                    'http://localhost:8080/api/volunteering/filtered',
                    { params: { labels: selectedFilters.join(',') } }
                );
                setFilteredVolunteerings(
                    Array.isArray(response.data) ? response.data : []
                );
            }
            setVisibleVolunteerings(6);
        } catch (error) {
            console.error('Error fetching filtered volunteerings:', error);
        }
    };

    const handleResetFilters = () => {
        setSelectedFilters([]);
        setFilteredVolunteerings(volunteerings);
        setVisibleVolunteerings(6);
    };

    const loadMoreVolunteerings = () => {
        setVisibleVolunteerings((prev) => prev + 6);
    };

    const allVolunteeringsLoaded = visibleVolunteerings >= filteredVolunteerings.length;

    const toggleFavorite = async (id, type) => {
        try {
            const isFavorite = favoriteIds.includes(`${id}-${type}`);
            const method = isFavorite ? 'DELETE' : 'POST';

            await axios({
                method,
                url: `http://localhost:8080/api/favorites/${
                    method === 'POST' ? 'add' : 'remove'
                }`,
                data: { card_id: id, card_type: type },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            setFavoriteIds((prev) =>
                isFavorite
                    ? prev.filter((fav) => fav !== `${id}-${type}`)
                    : [...prev, `${id}-${type}`]
            );
        } catch (error) {
            console.error('Failed to update favorite status:', error);
        }
    };

    const { t } = useTranslation();

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-custom-gradient-2 relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">
                        {t('pages.general-text.evit.volunteering')}
                    </h1>
                    <p className="text-2xl font-light">
                        {t('pages.general-text.pick-up-your-preferences')}
                    </p>
                </div>
                <div className="grid grid-cols-4 w-5/6 h-auto">
                    <Filter
                        filterList={[
                            {
                                isPrice: false,
                                title: 'Volunteering Types',
                                inputType: 'checkbox',
                                items: labels.map((label) => ({
                                    display: label,
                                    name: 'Volunteering_checkbox',
                                    id: label.replace(/\s+/g, '_').toLowerCase(),
                                    value: label,
                                })),
                            },
                        ]}
                        selectedValues={{ Volunteering_checkbox: selectedFilters }}
                        handleChange={handleChange}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                        handleFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                    />
                    <CardsContainer
                        volunteerings={filteredVolunteerings.slice(0, visibleVolunteerings)}
                        loadMoreVolunteerings={loadMoreVolunteerings}
                        allVolunteeringsLoaded={allVolunteeringsLoaded}
                        isFilterOpen={isFilterOpen}
                        favoriteIds={favoriteIds}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
                <Footer withBackground={false} />
            </div>
        </div>
    );
};

export default SectionWrapper(VolunteeringPage);
