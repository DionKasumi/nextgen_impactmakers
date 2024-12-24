import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const fetchInternships = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/internships');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching internships:', error);
        return [];
    }
};

const fetchInternshipLabels = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/internships/labels');
        let labels = response.data;

        // Ensure "Other" is at the end of the labels array
        labels = labels.filter((label) => label !== "Other");
        labels.push("Other");

        return labels;
    } catch (error) {
        console.error('Error fetching internship labels:', error);
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
                              isFavorite={favoriteIds.includes(
                                  `${internship.id}-internships`
                              )}
                              onToggleFavorite={() =>
                                  toggleFavorite(internship.id, 'internships')
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
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [labels, setLabels] = useState([]);
    const [visibleInternships, setVisibleInternships] = useState(6);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const internshipsData = await fetchInternships();
            setInternships(internshipsData.data);
            setFilteredInternships(internshipsData.data);

            const labelsData = await fetchInternshipLabels();
            setLabels(labelsData);

            const favoritesData = await fetchFavorites();
            setFavoriteIds(favoritesData);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === 'Internship_checkbox') {
            setSelectedFilters((prevFilters) => {
                if (checked) return [...prevFilters, value];
                return prevFilters.filter((filter) => filter !== value);
            });
        }
    };

    const handleSearch = async () => {
        try {
            if (selectedFilters.length === 0) {
                setFilteredInternships(internships);
            } else {
                const response = await axios.get('http://localhost:8080/api/internships/filtered', {
                    params: { labels: selectedFilters.join(',') },
                });
                setFilteredInternships(Array.isArray(response.data) ? response.data : []);
            }
            setVisibleInternships(6);
        } catch (error) {
            console.error('Error fetching filtered internships:', error);
        }
    };

    const handleResetFilters = () => {
        setSelectedFilters([]);
        setFilteredInternships(internships);
        setVisibleInternships(6);
    };

    const loadMoreInternships = () => {
        setVisibleInternships((prev) => prev + 6);
    };

    const allInternshipsLoaded = visibleInternships >= filteredInternships.length;

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
                        {t('pages.general-text.evit.internships')}
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
                                title: 'Internship Types',
                                inputType: 'checkbox',
                                items: labels.map((label) => ({
                                    display: label,
                                    name: 'Internship_checkbox',
                                    id: label.replace(/\s+/g, '_').toLowerCase(),
                                    value: label,
                                })),
                            },
                        ]}
                        selectedValues={{ Internship_checkbox: selectedFilters }}
                        handleChange={handleChange}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                        handleFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                    />
                    <CardsContainer
                        internships={filteredInternships.slice(0, visibleInternships)}
                        loadMoreInternships={loadMoreInternships}
                        allInternshipsLoaded={allInternshipsLoaded}
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

export default SectionWrapper(InternshipsPage);
