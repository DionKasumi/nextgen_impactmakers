import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import axios from 'axios';

// Function to fetch course data from the API
const fetchCourses = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/courses');
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
};

const CardsContainer = ({
    courses,
    loadMoreCourses,
    allCoursesLoaded,
    isFilterOpen,
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
                {courses.length > 0 ? (
                    courses.map((course, index) => (
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
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        No courses available
                    </p>
                )}
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

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCourses();
            setCourses(data);
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

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-[url('../assets/background.png')]  bg-no-repeat relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">Trainings</h1>
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
                        courses={courses.slice(0, visibleCourses)}
                        loadMoreCourses={loadMoreCourses}
                        allCoursesLoaded={allCoursesLoaded}
                        isFilterOpen={isFilterOpen}
                    />
                </div>
            </div>
        </div>
    );
};

export default SectionWrapper(TrainingsPage);
