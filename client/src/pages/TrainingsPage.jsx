import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const fetchCourses = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/courses');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
};

// Function to fetch course labels
const fetchCourseLabels = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/courses/labels');
        let labels = response.data;

        // Ensure "Other" is at the end of the labels array
        labels = labels.filter((label) => label !== "Other");
        labels.push("Other");

        console.log("Course labels fetched:", labels);
        return labels;
    } catch (error) {
        console.error('Error fetching course labels:', error);
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

        return (response.data || []).map(
            (fav) => `${fav.card_id}-${fav.card_type}`
        );
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

const CardsContainer = ({
    courses,
    loadMoreCourses,
    allCoursesLoaded,
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
                {courses.length > 0
                    ? courses.map((course, index) => (
                          <Card
                              key={index}
                              id={course.id}
                              card_title={course.title}
                              card_img={course.image_url}
                              card_duration={course.duration}
                              card_description={course.description}
                              card_price={course.price}
                              card_source={course.source}
                              card_type="courses"
                              isFavorite={favoriteIds.includes(
                                  `${course.id}-courses`
                              )}
                              onToggleFavorite={() =>
                                  toggleFavorite(course.id, 'courses')
                              }
                          />
                      ))
                    : Array(6)
                          .fill(null)
                          .map((_, index) => (
                              <SkeletonCard key={index} isSwiperCard={false} />
                          ))}
            </div>

            {!allCoursesLoaded && courses.length > 0 ? (
                <button
                    onClick={loadMoreCourses}
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

const TrainingsPage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [labels, setLabels] = useState([]);
    const [visibleCourses, setVisibleCourses] = useState(6);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const coursesData = await fetchCourses();
            setCourses(coursesData.data);
            setFilteredCourses(coursesData.data);

            const labelsData = await fetchCourseLabels();
            setLabels(labelsData);

            const favoritesData = await fetchFavorites();
            setFavoriteIds(favoritesData);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === 'Course_checkbox') {
            setSelectedFilters((prevFilters) => {
                if (checked) return [...prevFilters, value];
                return prevFilters.filter((filter) => filter !== value);
            });
        }
    };

    const handleSearch = async () => {
        try {
            if (selectedFilters.length === 0) {
                setFilteredCourses(courses);
            } else {
                const response = await axios.get('http://localhost:8080/api/courses/filtered', {
                    params: { labels: selectedFilters.join(',') },
                });
                setFilteredCourses(Array.isArray(response.data) ? response.data : []);
            }
            setVisibleCourses(6);
        } catch (error) {
            console.error('Error fetching filtered courses:', error);
        }
    };

    const handleResetFilters = () => {
        setSelectedFilters([]);
        setFilteredCourses(courses);
        setVisibleCourses(6);
    };

    const loadMoreCourses = () => {
        setVisibleCourses((prev) => prev + 6);
    };

    const allCoursesLoaded = visibleCourses >= filteredCourses.length;

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
                        {t('pages.general-text.evit.trainings')}
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
                                title: 'Course Types',
                                inputType: 'checkbox',
                                items: labels.map((label) => ({
                                    display: label,
                                    name: 'Course_checkbox',
                                    id: label.replace(/\s+/g, '_').toLowerCase(),
                                    value: label,
                                })),
                            },
                        ]}
                        selectedValues={{ Course_checkbox: selectedFilters }}
                        handleChange={handleChange}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                        handleFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                    />
                    <CardsContainer
                        courses={filteredCourses.slice(0, visibleCourses)}
                        loadMoreCourses={loadMoreCourses}
                        allCoursesLoaded={allCoursesLoaded}
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

export default SectionWrapper(TrainingsPage);
