import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

// Function to fetch course data from the API
const fetchCourses = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/courses');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching courses:', error);
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
                              isFavorite={favoriteIds.includes(course.id)}
                              onToggleFavorite={() => toggleFavorite(course.id)}
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
    const [visibleCourses, setVisibleCourses] = useState(6);
    const [selectedValues, setSelectedValues] = useState({
        minPrice: '',
        maxPrice: '',
    });
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const coursesData = await fetchCourses();
            setCourses(coursesData.data);

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

    const loadMoreCourses = () => {
        setVisibleCourses((prevVisibleCourses) => prevVisibleCourses + 6);
    };

    const allCoursesLoaded = visibleCourses >= courses.length;

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
                data: { card_id: id, card_type: 'courses' },
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
                                title: 'Fields',
                                items: [
                                    {
                                        display: 'Python',
                                        name: 'fields_radio',
                                        id: 'python',
                                        value: 'Python',
                                    },
                                    {
                                        display: 'Social Media',
                                        name: 'fields_radio',
                                        id: 'social_media',
                                        value: 'Social Media',
                                    },
                                    {
                                        display: 'Digital Marketing',
                                        name: 'fields_radio',
                                        id: 'digital_marketing',
                                        value: 'Digital Marketing',
                                    },
                                    {
                                        display: 'Graphic Design',
                                        name: 'fields_radio',
                                        id: 'graphic_design',
                                        value: 'Graphic Design',
                                    },
                                    {
                                        display: 'UI/UX',
                                        name: 'fields_radio',
                                        id: 'ui_ux',
                                        value: 'UI/UX',
                                    },
                                    {
                                        display: 'Cyber Security',
                                        name: 'fields_radio',
                                        id: 'cyber_security',
                                        value: 'Cyber Security',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Skill Level',
                                items: [
                                    {
                                        display: 'Beginner',
                                        name: 'skill_radio',
                                        id: 'Beginner',
                                        value: 'Beginner',
                                    },
                                    {
                                        display: 'Intermediete',
                                        name: 'skill_radio',
                                        id: 'intermediete',
                                        value: 'intermediete',
                                    },
                                    {
                                        display: 'Advanced',
                                        name: 'skill_radio',
                                        id: 'Advanced',
                                        value: 'Advanced',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Availability',
                                items: [
                                    {
                                        display: 'Event Classes',
                                        name: 'availability_radio',
                                        id: 'event_classes',
                                        value: 'Event Classes',
                                    },
                                    {
                                        display: 'Weekend Classes',
                                        name: 'availability_radio',
                                        id: 'weekend_classes',
                                        value: 'Weekend Classes',
                                    },
                                    {
                                        display: 'Flexibile',
                                        name: 'availability_radio',
                                        id: 'flexibile',
                                        value: 'Flexibile',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Duration',
                                items: [
                                    {
                                        display: 'Workshops',
                                        name: 'duration_radio',
                                        id: 'workshops',
                                        value: 'Workshops',
                                    },
                                    {
                                        display: '3 Months',
                                        name: 'duration_radio',
                                        id: 'three_months',
                                        value: '3 Months',
                                    },
                                    {
                                        display: '6 Months',
                                        name: 'duration_radio',
                                        id: 'six_months',
                                        value: '6 Months',
                                    },
                                    {
                                        display: '1 Year',
                                        name: 'duration_radio',
                                        id: 'one_year',
                                        value: '1 Year',
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
                        courses={
                            Array.isArray(courses)
                                ? courses.slice(0, visibleCourses)
                                : []
                        }
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
